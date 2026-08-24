import { Maker } from "@/models/Maker";
import { MakerCardComponent } from "../maker-card/maker-card.component";
import { Component } from "@angular/core";
import { MakerService } from "@/services/MakerService";

@Component({
  selector: "app-maker-list",
  standalone: true,
  imports: [MakerCardComponent],
  templateUrl: "./maker-list.component.html",
  styleUrl: "./maker-list.component.scss",
})
export class MakerListComponent {
  makers: Maker[] = [];

  constructor(private makerService: MakerService) {}

  ngOnInit(): void {
    this.loadMakers();
  }

  loadMakers() {
    this.makerService.getAllMakers().subscribe((makers) => {
      this.makers = makers;
    });
  }
}
