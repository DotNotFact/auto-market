import { MakerService } from "@/services/MakerService";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-maker-edit",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./maker-edit.component.html",
  styleUrl: "./maker-edit.component.scss",
})
export class MakerEditComponent {
  makerForm: FormGroup;
  makerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private makerService: MakerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.makerForm = this.fb.group({
      name: ["", Validators.required],
      country: ["", Validators.required],
      foundedYear: ["", [Validators.required, Validators.min(1886)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.makerId = params["id"];
      if (this.makerId) {
        this.makerService.getMakerById(this.makerId).subscribe((maker) => {
          this.makerForm.patchValue(maker);
        });
      }
    });
  }

  updateMaker() {
    if (this.makerForm.valid) {
      // +
      const updatedMaker = { ...this.makerForm.value, id: this.makerId };
      this.makerService.updateMaker(updatedMaker).subscribe({
        next: () => {
          this.router.navigate(["/maker-page"]);
        },
        error: (err) => {
          console.error("Error updating maker", err);
          alert(
            "Failed to update maker. Please check the console for details."
          );
        },
      });
    }
  }
}
