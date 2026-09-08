import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CatalogStore } from "@/services/CatalogStore";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
})
export class HomePageComponent {
  readonly countries = computed(
    () => new Set(this.store.makers().map((m) => m.country.trim().toLowerCase())).size
  );

  readonly oldest = computed(() => {
    const years = this.store.makers().map((m) => m.foundedYear).filter(Boolean);
    return years.length ? Math.min(...years) : null;
  });

  constructor(public store: CatalogStore) {
    this.store.ensureLoaded();
  }
}
