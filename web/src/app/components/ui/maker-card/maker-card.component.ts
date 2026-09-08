import { Maker } from "@/models/Maker";
import { CatalogStore } from "@/services/CatalogStore";
import { MakerService } from "@/services/MakerService";
import { ModelService } from "@/services/ModelService";
import { countryInfo } from "@/utils/country";
import { I18nPluralPipe } from "@angular/common";
import { Component, EventEmitter, Input, Output, computed, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

const PREVIEW_LIMIT = 4;

@Component({
  selector: "app-maker-card",
  standalone: true,
  imports: [RouterLink, I18nPluralPipe],
  templateUrl: "./maker-card.component.html",
  styleUrl: "./maker-card.component.scss",
})
export class MakerCardComponent {
  private readonly makerSig = signal<Maker | null>(null);

  @Input({ required: true }) set maker(value: Maker) {
    this.makerSig.set(value);
  }
  get maker(): Maker {
    return this.makerSig()!;
  }

  /** Emitted after any mutation so the parent can refresh the catalog. */
  @Output() changed = new EventEmitter<void>();

  readonly open = signal(false);

  readonly modelWord = {
    "=1": "Модель",
    few: "Модели",
    other: "Моделей",
  };

  readonly country = computed(() => countryInfo(this.makerSig()?.country));
  readonly modelCount = computed(() => this.makerSig()?.models?.length ?? 0);
  readonly sortedModels = computed(() =>
    [...(this.makerSig()?.models ?? [])].sort(
      (a, b) => b.releaseYear - a.releaseYear || a.name.localeCompare(b.name, "ru")
    )
  );
  readonly previewModels = computed(() => this.sortedModels().slice(0, PREVIEW_LIMIT));
  readonly hiddenCount = computed(() => Math.max(0, this.modelCount() - PREVIEW_LIMIT));

  constructor(
    public store: CatalogStore,
    private makerService: MakerService,
    private modelService: ModelService
  ) {}

  toggle() {
    this.open.update((v) => !v);
  }

  toggleCompare() {
    if (!this.store.toggleCompare(this.maker.id)) {
      alert(`В сравнении уже ${this.store.compareLimit} производителя. Уберите одного на странице «Сравнение».`);
    }
  }

  deleteMaker() {
    const maker = this.maker;
    const suffix = this.modelCount() > 0 ? ` вместе с ${this.modelCount()} моделями` : "";
    if (!confirm(`Удалить производителя «${maker.name}»${suffix}?`)) {
      return;
    }

    this.makerService.deleteMaker(maker.id).subscribe({
      next: () => this.changed.emit(),
      error: (err) => {
        console.error("Error deleting maker", err);
        alert("Не удалось удалить производителя. Подробности в консоли.");
      },
    });
  }

  deleteModel(id: string, name: string) {
    if (!confirm(`Удалить модель «${name}»?`)) {
      return;
    }

    this.modelService.deleteModel(id).subscribe({
      next: () => this.changed.emit(),
      error: (err) => {
        console.error("Error deleting model", err);
        alert("Не удалось удалить модель. Подробности в консоли.");
      },
    });
  }
}
