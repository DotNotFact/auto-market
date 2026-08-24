import { Component } from "@angular/core";
import { MakerListComponent } from "../../ui/maker-list/maker-list.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-maker-page",
  standalone: true,
  schemas: [],
  imports: [MakerListComponent, RouterLink],
  templateUrl: "./maker-page.component.html",
  styleUrl: "./maker-page.component.scss",
})
export class MakerPageComponent {}
