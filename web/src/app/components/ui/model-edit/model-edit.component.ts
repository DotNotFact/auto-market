import { Model } from "@/models/Model";
import { CatalogStore } from "@/services/CatalogStore";
import { MakerService } from "@/services/MakerService";
import { ModelService } from "@/services/ModelService";
import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-model-edit",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./model-edit.component.html",
  styleUrls: ["./model-edit.component.scss"],
})
export class ModelEditComponent implements OnInit {
  readonly maxYear = new Date().getFullYear() + 1;
  readonly saving = signal(false);
  readonly loading = signal(true);
  readonly submitError = signal<string | null>(null);
  readonly makerName = signal<string | null>(null);

  modelForm: FormGroup;
  makerId: string | null = null;
  modelId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private modelService: ModelService,
    private makerService: MakerService,
    private store: CatalogStore,
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe((params) => {
      this.makerId = params.get("makerId");
      this.modelId = params.get("modelId");

      if (this.makerId) {
        const cached = this.store.makerById(this.makerId);
        if (cached) {
          this.makerName.set(cached.name);
        } else {
          this.makerService.getMakerById(this.makerId).subscribe({
            next: (maker) => this.makerName.set(maker.name),
            error: (err) => console.error("Error loading maker", err),
          });
        }
      }

      if (!this.modelId) {
        return;
      }

      this.loading.set(true);
      this.modelService.getModelById(this.modelId).subscribe({
        next: (model) => {
          this.modelForm.patchValue(model);
          this.loading.set(false);
        },
        error: (err) => {
          console.error("Error loading model", err);
          this.loading.set(false);
          this.submitError.set("Не удалось загрузить модель.");
        },
      });
    });
  }

  invalid(control: string): boolean {
    const c = this.modelForm.get(control);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  saveModel() {
    this.modelForm.markAllAsTouched();
    if (this.modelForm.invalid || this.saving() || !this.modelId || !this.makerId) {
      return;
    }

    this.saving.set(true);
    this.submitError.set(null);

    const modelData: Model = {
      ...this.modelForm.value,
      id: this.modelId,
      makerId: this.makerId,
    };

    this.modelService.updateModel(modelData).subscribe({
      next: () => {
        this.store.refresh();
        this.router.navigate(["/maker-page"]);
      },
      error: (err) => {
        console.error("Error updating model", err);
        this.saving.set(false);
        this.submitError.set("Не удалось сохранить изменения. Проверьте, что API запущен.");
      },
    });
  }
}
