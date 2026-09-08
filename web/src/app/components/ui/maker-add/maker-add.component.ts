import { CatalogStore } from "@/services/CatalogStore";
import { MakerService } from "@/services/MakerService";
import { Component, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-maker-add",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./maker-add.component.html",
  styleUrls: ["./maker-add.component.scss"],
})
export class MakerAddComponent {
  readonly currentYear = new Date().getFullYear();
  readonly saving = signal(false);
  readonly submitError = signal<string | null>(null);

  makerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private makerService: MakerService,
    private store: CatalogStore,
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

  invalid(control: string): boolean {
    const c = this.makerForm.get(control);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  addMaker() {
    this.makerForm.markAllAsTouched();
    if (this.makerForm.invalid || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.submitError.set(null);

    this.makerService.addMaker(this.makerForm.value).subscribe({
      next: () => {
        this.store.refresh();
        this.router.navigate(["/maker-page"]);
      },
      error: (err) => {
        console.error("Error adding maker", err);
        this.saving.set(false);
        this.submitError.set("Не удалось сохранить производителя. Проверьте, что API запущен.");
      },
    });
  }
}
