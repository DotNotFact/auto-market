import { Routes } from "@angular/router";
import { HomePageComponent } from "./components/pages/home-page/home-page.component";
import { MakerPageComponent } from "./components/pages/maker-page/maker-page.component";
import { ModelPageComponent } from "./components/pages/model-page/model-page.component";
import { ComparePageComponent } from "./components/pages/compare-page/compare-page.component";
import { MakerAddComponent } from "./components/ui/maker-add/maker-add.component";
import { MakerEditComponent } from "./components/ui/maker-edit/maker-edit.component";
import { ModelAddComponent } from "./components/ui/model-add/model-add.component";
import { ModelEditComponent } from "./components/ui/model-edit/model-edit.component";

export const routes: Routes = [
  { path: "maker-page", component: MakerPageComponent, title: "Производители — AutoMarket" },
  { path: "model-page", component: ModelPageComponent, title: "Модели — AutoMarket" },
  { path: "compare-page", component: ComparePageComponent, title: "Сравнение — AutoMarket" },
  { path: "home-page", component: HomePageComponent, title: "О проекте — AutoMarket" },

  { path: "maker-add", component: MakerAddComponent, title: "Новый производитель — AutoMarket" },
  { path: "maker-edit/:id", component: MakerEditComponent, title: "Редактирование производителя — AutoMarket" },

  { path: "model-add/:makerId", component: ModelAddComponent, title: "Новая модель — AutoMarket" },
  { path: "model-edit/:modelId", component: ModelEditComponent, title: "Редактирование модели — AutoMarket" },

  { path: "", redirectTo: "/maker-page", pathMatch: "full" },
  { path: "**", redirectTo: "/maker-page" },
];
