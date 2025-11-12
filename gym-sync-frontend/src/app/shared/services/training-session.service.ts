import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { TrainingList } from '../models/training.model';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;
  getAllTrainings(): Observable<TrainingList[]> {
    return this.http.get<TrainingList[]>(`${this.baseUrl}/workout`);
  }
  getTraining(id: string): Observable<TrainingList> {
    return this.http.get<TrainingList>(`${this.baseUrl}/workout/${id}`);
  }
  addTraining(training: TrainingList): Observable<TrainingList> {
    return this.http.post<TrainingList>(
      `${this.baseUrl}/workout/add`,
      training
    );
  }
  updateTraining(training: TrainingList): Observable<TrainingList> {
    return this.http.put<TrainingList>(
      `${this.baseUrl}/workout/update/${training._id}`,
      training
    );
  }
  removeTraining(id: string): Observable<TrainingList> {
    return this.http.delete<TrainingList>(
      `${this.baseUrl}/workout/delete/${id}`
    );
  }
  // Poprzednia wersja pobieranie z pliku json
  async getTrainings(): Promise<TrainingList[]> {
    const response = await fetch('/trening.json');

    if (!response.ok)
      throw new Error('Nie udało się wczytać pliku trening.json');
    return response.json();
  }
}
