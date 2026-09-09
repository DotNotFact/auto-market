import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CatalogStore, MakerSort } from "@/services/CatalogStore";
import { MakerListComponent } from "../../ui/maker-list/maker-list.component";

@Component({
  selector: "app-maker-page",
  standalone: true,
  imports: [MakerListComponent, RouterLink],
  templateUrl: "./maker-page.component.html",
  styleUrl: "./maker-page.component.scss",
})
export class MakerPageComponent {
  readonly sortLabel = computed(() => {
    switch (this.store.sort()) {
      case "year-desc":
        return "По году ↓";
      case "year-asc":
        return "По году ↑";
      default:
        return "По году";
    }
  });

  constructor(public store: CatalogStore) {}

  toggleSort() {
    const next: Record<MakerSort, MakerSort> = {
      name: "year-desc",
      "year-desc": "year-asc",
      "year-asc": "name",
    };
    this.store.sort.set(next[this.store.sort()]);
  }
}
