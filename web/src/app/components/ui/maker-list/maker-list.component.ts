import { Component, Input, computed, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Maker } from "@/models/Maker";
import { CatalogStore } from "@/services/CatalogStore";
import { countryInfo } from "@/utils/country";
import { MakerCardComponent } from "../maker-card/maker-card.component";

export type RegionFilter = "all" | "europe" | "asia" | "usa";
export type MakerSort = "name" | "year-desc" | "year-asc";

@Component({
  selector: "app-maker-list",
  standalone: true,
  imports: [MakerCardComponent, RouterLink],
  templateUrl: "./maker-list.component.html",
  styleUrl: "./maker-list.component.scss",
})
export class MakerListComponent {
  private readonly regionSig = signal<RegionFilter>("all");
  private readonly sortSig = signal<MakerSort>("name");

  @Input() set region(value: RegionFilter) {
    this.regionSig.set(value);
  }

  @Input() set sort(value: MakerSort) {
    this.sortSig.set(value);
  }

  readonly visible = computed<Maker[]>(() => {
    const query = this.store.query().trim().toLowerCase();
    const region = this.regionSig();
    const sort = this.sortSig();

    const filtered = this.store.makers().filter((maker) => {
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

  readonly visibleCount = computed(() => this.visible().length);

  constructor(public store: CatalogStore) {
    this.store.ensureLoaded();
  }
}
