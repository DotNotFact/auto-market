import { Model } from "./Model";

export interface Maker {
  id: string;
  name: string;
  country: string;
  foundedYear: number;
  models: Model[];
}
