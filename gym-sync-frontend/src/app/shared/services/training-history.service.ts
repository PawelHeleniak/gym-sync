import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import {
  WorkoutHistory,
  MonthlyWorkoutCounts,
} from '../../shared/models/trainingHistory.model';
import { TrainingList } from '../../shared/models/training.model';

@Injectable({ providedIn: 'root' })
export class TrainingHistoryService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;

  addHistoryTraining(body: TrainingList): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/history/add`, body);
  }
  getHistoryTrainings(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/history/${id}`);
  }
  getAllHistory() {
    return this.http.get<WorkoutHistory[]>(`${this.baseUrl}/history`);
  }
  getMonthlyWorkoutCounts(year: number): Observable<MonthlyWorkoutCounts> {
    return this.http.get<MonthlyWorkoutCounts>(
      `${this.baseUrl}/history/monthly-counts`,
      {
        params: { year: year.toString() },
      },
    );
  }
}
