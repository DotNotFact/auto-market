import { Model } from "@/models/Model";
import { MakerService } from "@/services/MakerService";
import { ModelService } from "@/services/ModelService";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-model-add",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./model-add.component.html",
  styleUrl: "./model-add.component.scss",
})
export class ModelAddComponent implements OnInit {
  modelForm: FormGroup;
  makerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modelService: ModelService,
    private router: Router
  ) {
    this.modelForm = this.fb.group({
      name: ["", Validators.required],
      releaseYear: ["", [Validators.required, Validators.min(1886)]],
    });
  }

  ngOnInit(): void {
    this.makerId = this.route.snapshot.paramMap.get("makerId");
  }

  addModel() {
    if (this.modelForm.valid && this.makerId) {
      const modelData: Model = {
        ...this.modelForm.value,
        makerId: this.makerId,
      };

      this.modelService.addModel(modelData).subscribe({
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
