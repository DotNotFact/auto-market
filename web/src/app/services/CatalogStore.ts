import { Injectable, computed, signal } from "@angular/core";
import { Maker } from "@/models/Maker";
import { countryInfo } from "@/utils/country";
import { MakerService } from "./MakerService";

export type RegionFilter = "all" | "europe" | "asia" | "usa";
export type MakerSort = "name" | "year-desc" | "year-asc";

/**
 * Single in-memory source of truth for the catalog.
 * Loaded once from the API and refreshed after every mutation,
 * so the header search, the counters and the lists stay in sync.
 */
@Injectable({ providedIn: "root" })
export class CatalogStore {
  readonly makers = signal<Maker[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly query = signal("");
  readonly region = signal<RegionFilter>("all");
  readonly sort = signal<MakerSort>("name");

  readonly totalModels = computed(() =>
    this.makers().reduce((sum, m) => sum + (m.models?.length ?? 0), 0)
  );

  /** Makers left after the header search, the region filter and the chosen sort. */
  readonly visibleMakers = computed<Maker[]>(() => {
    const query = this.query().trim().toLowerCase();
    const region = this.region();
    const sort = this.sort();

    const filtered = this.makers().filter((maker) => {
      if (region !== "all" && countryInfo(maker.country).region !== region) {
        return false;
      }
      if (!query) {
        return true;
      }
      const haystack = [
        maker.name,
        maker.country,
        String(maker.foundedYear),
        ...(maker.models ?? []).map((m) => m.name),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "year-desc":
          return b.foundedYear - a.foundedYear || a.name.localeCompare(b.name, "ru");
        case "year-asc":
          return a.foundedYear - b.foundedYear || a.name.localeCompare(b.name, "ru");
        default:
          return a.name.localeCompare(b.name, "ru");
      }
    });
  });

  readonly visibleCount = computed(() => this.visibleMakers().length);

  /** Ids of makers picked for side-by-side comparison, in pick order. */
  readonly compareIds = signal<string[]>(this.readCompareIds());
  readonly compareLimit = 4;

  readonly compareMakers = computed(() =>
    this.compareIds()
      .map((id) => this.makers().find((m) => m.id === id))
      .filter((m): m is Maker => !!m)
  );

  private loadedOnce = false;

  constructor(private makerService: MakerService) {}

  isCompared(id: string): boolean {
    return this.compareIds().includes(id);
  }

  /** Adds or removes a maker from the comparison; returns false when the limit is reached. */
  toggleCompare(id: string): boolean {
    const ids = this.compareIds();
    if (ids.includes(id)) {
      this.setCompareIds(ids.filter((x) => x !== id));
      return true;
    }
    if (ids.length >= this.compareLimit) {
      return false;
    }
    this.setCompareIds([...ids, id]);
    return true;
  }

  clearCompare() {
    this.setCompareIds([]);
  }

  private setCompareIds(ids: string[]) {
    this.compareIds.set(ids);
    try {
      localStorage.setItem("automarket.compare", JSON.stringify(ids));
    } catch {
      /* storage unavailable - comparison just won't survive a reload */
    }
  }

  private readCompareIds(): string[] {
    try {
      const raw = localStorage.getItem("automarket.compare");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  }

  /** Loads the catalog if it has not been loaded yet. */
  ensureLoaded() {
    if (!this.loadedOnce && !this.loading()) {
      this.refresh();
    }
  }

  refresh() {
    this.loading.set(true);
    this.error.set(null);
    this.makerService.getAllMakers().subscribe({
      next: (makers) => {
        this.makers.set(
          [...makers].sort((a, b) => a.name.localeCompare(b.name, "ru"))
        );
        this.loadedOnce = true;
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Failed to load makers", err);
        this.error.set(
          "Не удалось загрузить каталог. Проверьте, что API запущен."
        );
        this.loading.set(false);
      },
    });
  }

  makerById(id: string): Maker | undefined {
    return this.makers().find((m) => m.id === id);
  }
}
