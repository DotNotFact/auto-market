import { Model } from "@/models/Model";
import { CatalogStore } from "@/services/CatalogStore";
import { MakerService } from "@/services/MakerService";
import { ModelService } from "@/services/ModelService";
import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-model-add",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./model-add.component.html",
  styleUrl: "./model-add.component.scss",
})
export class ModelAddComponent implements OnInit {
  readonly maxYear = new Date().getFullYear() + 1;
  readonly saving = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly makerName = signal<string | null>(null);

  modelForm: FormGroup;
  makerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modelService: ModelService,
    private makerService: MakerService,
    private store: CatalogStore,
    private router: Router
  ) {
    this.modelForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      releaseYear: [
        "",
        [Validators.required, Validators.min(1886), Validators.max(this.maxYear)],
      ],
    });
  }

  ngOnInit(): void {
    this.makerId = this.route.snapshot.paramMap.get("makerId");
    if (!this.makerId) {
      return;
    }

    const cached = this.store.makerById(this.makerId);
    if (cached) {
      this.makerName.set(cached.name);
      return;
    }

    this.makerService.getMakerById(this.makerId).subscribe({
      next: (maker) => this.makerName.set(maker.name),
      error: (err) => console.error("Error loading maker", err),
    });
  }

  invalid(control: string): boolean {
    const c = this.modelForm.get(control);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  addModel() {
    this.modelForm.markAllAsTouched();
    if (this.modelForm.invalid || this.saving() || !this.makerId) {
      return;
    }

    this.saving.set(true);
    this.submitError.set(null);

    const modelData: Model = { ...this.modelForm.value, makerId: this.makerId };

    this.modelService.addModel(modelData).subscribe({
      next: () => {
        this.store.refresh();
        this.router.navigate(["/maker-page"]);
      },
      error: (err) => {
        console.error("Error adding model", err);
        this.saving.set(false);
        this.submitError.set("Не удалось сохранить модель. Проверьте, что API запущен.");
      },
    });
  }
}
