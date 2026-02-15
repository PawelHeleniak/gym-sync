import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingHistoryService } from '../../../shared/services/training-history.service';
import { TrainingService } from '../../../shared/services/training-session.service';
import { TrainingList } from '../../../shared/models/training.model';
import { WorkoutHistory } from '../../../shared/models/trainingHistory.model';
import { formatTime } from '../../../shared/utils/time';

@Component({
  selector: 'app-training-report',
  imports: [CommonModule],
  templateUrl: './training-report.html',
  styleUrl: './training-report.scss',
})
export class TrainingReport {
  trainings: TrainingList[] = [];
  allHistoryTraining: WorkoutHistory[] = [];
  activeId: string = '';

  constructor(
    private trainingHistoryService: TrainingHistoryService,
    private trainingService: TrainingService,
  ) {}

  ngOnInit() {
    this.getTraining();
  }

  getTraining() {
    this.trainingService.getAllTrainings().subscribe({
      next: (response: TrainingList[]) => {
        this.trainings = response;
        this.trainings.forEach((training) => {
          this.getHistoryTrainingCount(training._id ?? '');
        });
        console.log(response);
      },
      error: (error) => {
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
            (el) => el._id === response[0].planId,
          );
          if (count) count.historyCount = response.length;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  // ***
  getHistoryTraining(id: string) {
    this.activeId = id;
    this.trainingHistoryService.getHistoryTrainings(id).subscribe({
      next: (response: any) => {
        this.allHistoryTraining = response;
        console.log(response);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  format(time: number) {
    return formatTime(time);
  }
}
