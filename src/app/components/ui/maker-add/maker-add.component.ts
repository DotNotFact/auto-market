import { MakerService } from "@/services/MakerService";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-maker-add",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./maker-add.component.html",
  styleUrls: ["./maker-add.component.scss"],
})
export class MakerAddComponent implements OnInit {
  makerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private makerService: MakerService,
    private router: Router
  ) {
    this.makerForm = this.fb.group({
      name: ["", Validators.required],
      country: ["", Validators.required],
      foundedYear: ["", [Validators.required, Validators.min(1886)]],
    });
  }

  ngOnInit(): void {}

  addMaker() {
    if (this.makerForm.valid) {
      this.makerService.addMaker(this.makerForm.value).subscribe({
        next: () => {
          this.router.navigate(["/maker-page"]);
        },
        error: (err) => {
          console.error("Error adding maker", err);
          alert("Failed to add maker. Please check the console for details.");
        },
      });
    }
  }

  updateMaker() {
    if (this.makerForm.valid) {
      this.makerService.updateMaker(this.makerForm.value).subscribe({
        next: () => {},
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
