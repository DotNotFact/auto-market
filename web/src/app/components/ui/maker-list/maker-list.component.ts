import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CatalogStore } from "@/services/CatalogStore";
import { MakerCardComponent } from "../maker-card/maker-card.component";

@Component({
  selector: "app-maker-list",
  standalone: true,
  imports: [MakerCardComponent, RouterLink],
  templateUrl: "./maker-list.component.html",
  styleUrl: "./maker-list.component.scss",
})
export class MakerListComponent {
  constructor(public store: CatalogStore) {
    this.store.ensureLoaded();
  }
}
