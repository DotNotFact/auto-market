import { RouterOutlet } from "@angular/router";
import { Component } from "@angular/core";
import { HeaderComponent } from "./components/ui/header/header.component";
import { FooterComponent } from "./components/ui/footer/footer.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "auto-market-app";
}
