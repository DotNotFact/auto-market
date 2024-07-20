import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Maker } from "@/models/Maker";

@Injectable({
  providedIn: "root",
})
export class MakerService {
  private apiUrl = "https://localhost:7141/api/Car";

  constructor(private http: HttpClient) {}

  getAllMakers(): Observable<Maker[]> {
    return this.http.get<Maker[]>(`${this.apiUrl}/get-all-makers`);
  }

  getMakerById(id: string): Observable<Maker> {
    return this.http.get<Maker>(`${this.apiUrl}/get-maker`, {
      params: { id },
    });
  }

  addMaker(maker: Maker): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add-maker`, maker);
  }

  updateMaker(maker: Maker): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update-maker`, maker);
  }

  deleteMaker(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-maker`, {
      params: { id },
    });
  }
}
