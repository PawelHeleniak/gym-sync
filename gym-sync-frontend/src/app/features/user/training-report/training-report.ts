import { Component } from '@angular/core';
import { TrainingHistoryService } from '../../../shared/services/training-history.service';
import { TrainingService } from '../../../shared/services/training-session.service';
import { TrainingList } from '../../../shared/models/training.model';

@Component({
  selector: 'app-training-report',
  imports: [],
  templateUrl: './training-report.html',
  styleUrl: './training-report.scss',
})
export class TrainingReport {
  constructor(
    private trainingHistoryService: TrainingHistoryService,
    private trainingService: TrainingService
  ) {}
  trainings: TrainingList[] = [];

  ngOnInit() {
    this.getTraining();
  }
  getTraining() {
    this.trainingService.getAllTrainings().subscribe({
      next: (response: any) => {
        this.trainings = response;
        this.trainings.forEach((training) => {
          this.getHistoryTrainingCount(training._id ?? '');
        });
        console.log(response);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  // *** Tymczasowo dopóki nie dodam licznika po backendzie ***
  getHistoryTrainingCount(id: string) {
    this.trainingHistoryService.getHistoryTrainings(id).subscribe({
      next: (response: any) => {
        if (response.length) {
          const count = this.trainings.find(
            (el) => el._id === response[0].planId
          );
          if (count) count.historyCount = response.length;
        }
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  // ***
  getHistoryTraining(id: string) {
    this.trainingHistoryService.getHistoryTrainings(id).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
