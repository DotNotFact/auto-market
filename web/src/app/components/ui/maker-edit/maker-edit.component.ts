import { CatalogStore } from "@/services/CatalogStore";
import { MakerService } from "@/services/MakerService";
import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-maker-edit",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./maker-edit.component.html",
  styleUrl: "./maker-edit.component.scss",
})
export class MakerEditComponent implements OnInit {
  readonly currentYear = new Date().getFullYear();
  readonly saving = signal(false);
  readonly loading = signal(true);
  readonly submitError = signal<string | null>(null);

  makerForm: FormGroup;
  makerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private makerService: MakerService,
    private store: CatalogStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.makerForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      country: ["", [Validators.required, Validators.maxLength(100)]],
      foundedYear: [
        "",
        [Validators.required, Validators.min(1886), Validators.max(this.currentYear)],
      ],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.makerId = params.get("id");
      if (!this.makerId) {
        return;
      }

      this.loading.set(true);
      this.makerService.getMakerById(this.makerId).subscribe({
        next: (maker) => {
          this.makerForm.patchValue(maker);
          this.loading.set(false);
        },
        error: (err) => {
          console.error("Error loading maker", err);
          this.loading.set(false);
          this.submitError.set("Не удалось загрузить производителя.");
        },
      });
    });
  }

  invalid(control: string): boolean {
    const c = this.makerForm.get(control);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  updateMaker() {
    this.makerForm.markAllAsTouched();
    if (this.makerForm.invalid || this.saving() || !this.makerId) {
      return;
    }

    this.saving.set(true);
    this.submitError.set(null);

    const updatedMaker = { ...this.makerForm.value, id: this.makerId };
    this.makerService.updateMaker(updatedMaker).subscribe({
      next: () => {
        this.store.refresh();
        this.router.navigate(["/maker-page"]);
      },
      error: (err) => {
        console.error("Error updating maker", err);
        this.saving.set(false);
        this.submitError.set("Не удалось сохранить изменения. Проверьте, что API запущен.");
      },
    });
  }
}
