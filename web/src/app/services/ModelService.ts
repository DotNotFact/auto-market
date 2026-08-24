import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Model } from "@/models/Model";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ModelService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getModelById(id: string): Observable<Model> {
    return this.http.get<Model>(`${this.apiUrl}/get-model`, { params: { id } });
  }

  addModel(model: Model): Observable<void> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post<void>(`${this.apiUrl}/add-model`, model, { headers });
  }

  updateModel(model: Model): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update-model`, model);
  }

  deleteModel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-model`, {
      params: { id },
    });
  }
}
