import { Component, computed, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Maker } from "@/models/Maker";
import { Model } from "@/models/Model";
import { CatalogStore } from "@/services/CatalogStore";
import { ModelService } from "@/services/ModelService";
import { CountryInfo, countryInfo } from "@/utils/country";

type ModelSort = "name" | "year" | "maker";

interface ModelRow {
  model: Model;
  maker: Maker;
  country: CountryInfo;
}

@Component({
  selector: "app-model-page",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./model-page.component.html",
  styleUrl: "./model-page.component.scss",
})
export class ModelPageComponent {
  readonly sort = signal<ModelSort>("name");

  readonly rows = computed<ModelRow[]>(() => {
    const query = this.store.query().trim().toLowerCase();
    const sort = this.sort();

    const rows: ModelRow[] = this.store.makers().flatMap((maker) =>
      (maker.models ?? []).map((model) => ({
        model,
        maker,
        country: countryInfo(maker.country),
      }))
    );

    const filtered = query
      ? rows.filter((r) =>
          `${r.model.name} ${r.maker.name} ${r.maker.country} ${r.model.releaseYear}`
            .toLowerCase()
            .includes(query)
        )
      : rows;

    return filtered.sort((a, b) => {
      switch (sort) {
        case "year":
          return b.model.releaseYear - a.model.releaseYear || a.model.name.localeCompare(b.model.name, "ru");
        case "maker":
          return a.maker.name.localeCompare(b.maker.name, "ru") || a.model.name.localeCompare(b.model.name, "ru");
        default:
          return a.model.name.localeCompare(b.model.name, "ru");
      }
    });
  });

  constructor(
    public store: CatalogStore,
    private modelService: ModelService
  ) {
    this.store.ensureLoaded();
  }

  deleteModel(id: string, name: string) {
    if (!confirm(`Удалить модель «${name}»?`)) {
      return;
    }

    this.modelService.deleteModel(id).subscribe({
      next: () => this.store.refresh(),
      error: (err) => {
        console.error("Error deleting model", err);
        alert("Не удалось удалить модель. Подробности в консоли.");
      },
    });
  }
}
