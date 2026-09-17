import { Component, computed, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Maker } from "@/models/Maker";
import { CatalogStore } from "@/services/CatalogStore";
import { CountryInfo, REGION_LABELS, countryInfo } from "@/utils/country";

interface CompareCell {
  text: string;
  sub?: string;
  best: boolean;
}

interface CompareRow {
  label: string;
  hint?: string;
  cells: CompareCell[];
}

interface CompareColumn {
  maker: Maker;
  country: CountryInfo;
}

@Component({
  selector: "app-compare-page",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./compare-page.component.html",
  styleUrl: "./compare-page.component.scss",
})
export class ComparePageComponent {
  readonly pickerQuery = signal("");
  readonly limitHit = signal(false);

  readonly columns = computed<CompareColumn[]>(() =>
    this.store.compareMakers().map((maker) => ({ maker, country: countryInfo(maker.country) }))
  );

  readonly candidates = computed(() => {
    const q = this.pickerQuery().trim().toLowerCase();
    return this.store
      .makers()
      .filter((m) => !q || m.name.toLowerCase().includes(q) || m.country.toLowerCase().includes(q));
  });

  readonly rows = computed<CompareRow[]>(() => {
    const cols = this.columns();
    if (cols.length === 0) {
      return [];
    }

    const year = new Date().getFullYear();
    const stats = cols.map(({ maker, country }) => {
      const models = maker.models ?? [];
      const years = models.map((m) => m.releaseYear).filter((y) => y > 0);
      const newest = models.reduce<typeof models[number] | null>(
        (best, m) => (!best || m.releaseYear > best.releaseYear ? m : best),
        null
      );
      const oldest = models.reduce<typeof models[number] | null>(
        (best, m) => (!best || m.releaseYear < best.releaseYear ? m : best),
        null
      );
      return {
        country,
        founded: maker.foundedYear,
        age: year - maker.foundedYear,
        count: models.length,
        newest,
        oldest,
        avg: years.length ? Math.round(years.reduce((a, b) => a + b, 0) / years.length) : null,
        recent: models.filter((m) => m.releaseYear >= year - 2).length,
      };
    });

    const bestMax = (values: (number | null)[]) => {
      const valid = values.filter((v): v is number => v !== null);
      if (valid.length < 2) return values.map(() => false);
      const max = Math.max(...valid);
      return values.map((v) => v === max);
    };
    const bestMin = (values: (number | null)[]) => {
      const valid = values.filter((v): v is number => v !== null);
      if (valid.length < 2) return values.map(() => false);
      const min = Math.min(...valid);
      return values.map((v) => v === min);
    };

    const foundedBest = bestMin(stats.map((s) => s.founded));
    const countBest = bestMax(stats.map((s) => s.count));
    const newestBest = bestMax(stats.map((s) => s.newest?.releaseYear ?? null));
    const avgBest = bestMax(stats.map((s) => s.avg));
    const recentBest = bestMax(stats.map((s) => s.recent));

    return [
      {
        label: "Страна",
        cells: cols.map(({ maker }, i) => ({
          text: maker.country,
          sub: stats[i].country.region === "other" ? undefined : REGION_LABELS[stats[i].country.region as keyof typeof REGION_LABELS],
          best: false,
        })),
      },
      {
        label: "Год основания",
        hint: "старейший",
        cells: stats.map((s, i) => ({ text: String(s.founded), sub: `${s.age} лет`, best: foundedBest[i] })),
      },
      {
        label: "Моделей в каталоге",
        hint: "больше",
        cells: stats.map((s, i) => ({ text: String(s.count), best: countBest[i] })),
      },
      {
        label: "Новейшая модель",
        hint: "свежее",
        cells: stats.map((s, i) => ({
          text: s.newest ? String(s.newest.releaseYear) : "-",
          sub: s.newest?.name,
          best: newestBest[i],
        })),
      },
      {
        label: "Первая модель в каталоге",
        cells: stats.map((s) => ({
          text: s.oldest ? String(s.oldest.releaseYear) : "-",
          sub: s.oldest?.name,
          best: false,
        })),
      },
      {
        label: "Средний год выпуска",
        hint: "свежее",
        cells: stats.map((s, i) => ({ text: s.avg ? String(s.avg) : "-", best: avgBest[i] })),
      },
      {
        label: "Моделей за последние 3 года",
        hint: "больше",
        cells: stats.map((s, i) => ({ text: String(s.recent), best: recentBest[i] })),
      },
    ];
  });

  constructor(public store: CatalogStore) {
    this.store.ensureLoaded();
  }

  toggle(id: string) {
    this.limitHit.set(!this.store.toggleCompare(id));
  }

  remove(id: string) {
    this.store.toggleCompare(id);
    this.limitHit.set(false);
  }

  onPickerInput(event: Event) {
    this.pickerQuery.set((event.target as HTMLInputElement).value);
  }

  modelPreview(maker: Maker): string[] {
    return [...(maker.models ?? [])]
      .sort((a, b) => b.releaseYear - a.releaseYear || a.name.localeCompare(b.name, "ru"))
      .slice(0, 6)
      .map((m) => m.name);
  }

  extraModels(maker: Maker): number {
    return Math.max(0, (maker.models?.length ?? 0) - 6);
  }
}
