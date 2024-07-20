import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MakerService } from "@/services/MakerService";
import { CommonModule } from "@angular/common";
import { ModelService } from "@/services/ModelService";

@Component({
  selector: "app-model-edit",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./model-edit.component.html",
  styleUrls: ["./model-edit.component.scss"],
})
export class ModelEditComponent implements OnInit {
  modelForm: FormGroup;
  makerId: string | null = null;
  modelId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private makerService: ModelService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.modelForm = this.fb.group({
      name: ["", Validators.required],
      releaseYear: ["", [Validators.required, Validators.min(1886)]],
    });
  }

  ngOnInit(): void {
    this.makerId = this.route.snapshot.paramMap.get("makerId");
    this.modelId = this.route.snapshot.paramMap.get("modelId");

    if (this.modelId) {
      this.makerService.getModelById(this.modelId).subscribe((model) => {
        this.modelForm.patchValue(model);
      });
    }
  }

  saveModel() {
    if (this.modelForm.valid) {
      const modelData = { ...this.modelForm.value, makerId: this.makerId };
      if (this.modelId) {
        this.makerService
          .updateModel({ ...modelData, id: this.modelId })
          .subscribe({
            next: () => {
              this.router.navigate(["/maker-page"]);
            },
            error: (err) => {
              console.error("Error updating model", err);
              alert(
                "Failed to update model. Please check the console for details."
              );
            },
          });
      } else {
        this.makerService.addModel(modelData).subscribe({
          next: () => {
            this.router.navigate(["/maker-page"]);
          },
          error: (err) => {
            console.error("Error adding model", err);
            alert("Failed to add model. Please check the console for details.");
          },
        });
      }
    }
  }
}
