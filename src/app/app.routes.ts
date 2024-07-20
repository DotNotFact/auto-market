import { HomePageComponent } from "./components/pages/home-page/home-page.component";
import { MakerPageComponent } from "./components/pages/maker-page/maker-page.component";
import { MakerAddComponent } from "./components/ui/maker-add/maker-add.component";
import { Routes } from "@angular/router";
import { MakerEditComponent } from "./components/ui/maker-edit/maker-edit.component";
import { ModelEditComponent } from "./components/ui/model-edit/model-edit.component";

export const routes: Routes = [
  { path: "home-page", component: HomePageComponent },
  { path: "maker-page", component: MakerPageComponent },
  { path: "maker-add", component: MakerAddComponent },
  { path: "maker-edit/:id", component: MakerEditComponent },
  { path: "model-add/:makerId", component: ModelEditComponent }, // Route for adding a model
  { path: "model-edit/:modelId", component: ModelEditComponent }, // Route for editing a model

  { path: "", redirectTo: "/home-page", pathMatch: "full" },
];
// export const routes: Routes = [
//   { path: '', component: HomeComponent }, // Главная
//   { path: 'makers', component: MakersComponent }, // Производители
//   { path: 'maker-form', component: MakerFormComponent }, // Форма для добавления/обновления производителей
//   { path: 'models', component: ModelsComponent }, // Модели
//   { path: '**', redirectTo: '' } // Редирект на главную для несуществующих маршрутов
// ];
