import { Maker } from "@/models/Maker";
import { MakerService } from "@/services/MakerService";
import { ModelService } from "@/services/ModelService";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-maker-card",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./maker-card.component.html",
  styleUrl: "./maker-card.component.scss",
})
export class MakerCardComponent {
  @Input() maker!: Maker;
  @Output() makerDeleted = new EventEmitter<void>();

  constructor(
    private makerService: MakerService,
    private modelService: ModelService
  ) {}

  deleteMaker(id: string) {
    this.makerService.deleteMaker(id).subscribe({
      next: () => {
        this.makerDeleted.emit();
      },
      error: (err) => {
        console.error("Error deleting maker", err);
        alert("Failed to delete maker. Please check the console for details.");
      },
    });
  }

  deleteModel(id: string) {
    this.modelService.deleteModel(id).subscribe({
      next: () => {
        this.makerDeleted.emit();
      },
      error: (err) => {
        console.error("Error deleting maker", err);
        alert("Failed to delete maker. Please check the console for details.");
      },
    });
  }
}
