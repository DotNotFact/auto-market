import { Injectable, computed, signal } from "@angular/core";
import { Maker } from "@/models/Maker";
import { MakerService } from "./MakerService";

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

  readonly totalModels = computed(() =>
    this.makers().reduce((sum, m) => sum + (m.models?.length ?? 0), 0)
  );

  private loadedOnce = false;

  constructor(private makerService: MakerService) {}

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
