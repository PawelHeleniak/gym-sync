import { HttpClient, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { TrainingList } from '../models/training.model';

interface UpdateTrainingResponse {
  message: string;
  workout: TrainingList;
}
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
      training,
    );
  }
  updateTraining(
    training: TrainingList,
    additionalId?: string,
  ): Observable<UpdateTrainingResponse> {
    return this.http.put<UpdateTrainingResponse>(
      `${this.baseUrl}/workout/update/${
        additionalId ? additionalId : training._id
      }`,
      training,
    );
  }
  removeTraining(id: string): Observable<TrainingList> {
    return this.http.delete<TrainingList>(
      `${this.baseUrl}/workout/delete/${id}`,
    );
  }
}
