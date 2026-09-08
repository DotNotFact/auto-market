import { Component, computed, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MakerListComponent, MakerSort, RegionFilter } from "../../ui/maker-list/maker-list.component";

@Component({
  selector: "app-maker-page",
  standalone: true,
  imports: [MakerListComponent, RouterLink],
  templateUrl: "./maker-page.component.html",
  styleUrl: "./maker-page.component.scss",
})
export class MakerPageComponent {
  readonly region = signal<RegionFilter>("all");
  readonly sort = signal<MakerSort>("name");

  readonly sortLabel = computed(() => {
    switch (this.sort()) {
      case "year-desc":
        return "По году ↓";
      case "year-asc":
        return "По году ↑";
      default:
        return "По году";
    }
  });

  toggleSort() {
    const next: Record<MakerSort, MakerSort> = {
      name: "year-desc",
      "year-desc": "year-asc",
      "year-asc": "name",
    };
    this.sort.set(next[this.sort()]);
  }
}
