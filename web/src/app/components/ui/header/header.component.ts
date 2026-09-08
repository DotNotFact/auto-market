import { Component, computed } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CatalogStore } from "@/services/CatalogStore";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  readonly placeholder = computed(() => {
    const total = this.store.totalModels();
    return total > 0 ? `Поиск по ${total} моделям…` : "Поиск по каталогу…";
  });

  constructor(public store: CatalogStore) {
    this.store.ensureLoaded();
  }

  onSearch(event: Event) {
    this.store.query.set((event.target as HTMLInputElement).value);
  }
}
