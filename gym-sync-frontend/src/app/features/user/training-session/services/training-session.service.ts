import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;
  getAllTrainings(): Observable<trainingList[]> {
    return this.http.get<trainingList[]>(`${this.baseUrl}/workout`);
  }
  addTraining(training: trainingList): Observable<trainingList> {
    return this.http.post<trainingList>(
      `${this.baseUrl}/workout/add`,
      training
    );
  }
  // Poprzednia wersja pobieranie z pliku json
  async getTrainings(): Promise<trainingList[]> {
    const response = await fetch('/trening.json');

    if (!response.ok)
      throw new Error('Nie udało się wczytać pliku trening.json');
    return response.json();
  }
}
