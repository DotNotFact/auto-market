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
import { Model } from "@/models/Model";

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
    private modelService: ModelService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.modelForm = this.fb.group({
      name: ["", Validators.required],
      releaseYear: ["", [Validators.required, Validators.min(1886)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.makerId = params.get("makerId");
      this.modelId = params.get("modelId");

      if (this.modelId) {
        this.modelService.getModelById(this.modelId).subscribe((model) => {
          this.modelForm.patchValue(model);
        });
      }
    });
  }

  saveModel() {
    if (this.modelForm.valid) {
      const modelData: Model = {
        ...this.modelForm.value,
        id: this.modelId,
        makerId: this.makerId,
      };
      if (this.modelId) {
        this.modelService.updateModel(modelData).subscribe({
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
      }
    }
  }
}
