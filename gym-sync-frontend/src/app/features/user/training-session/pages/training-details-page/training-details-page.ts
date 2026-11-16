import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { formatTime } from '../../../../../shared/utils/time';
import { TrainingList } from '../../../../../shared/models/training.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TrainingService } from '../../../../../shared/services/training-session.service';

@Component({
  selector: 'app-training-details-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './training-details-page.html',
  styleUrl: './training-details-page.scss',
})
export class TrainingDetailsPage {
  trainingService = inject(TrainingService);
  activedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.time = formatTime(this.selectedTraining.estimatedTime);
    this.getWorkout();
  }

  routerId: string = '';
  time: string = '';
  stepsView: boolean = false;
  selectedTraining: TrainingList = {
    name: '',
    estimatedTime: 0,
    exercises: [],
  };
  // @Output() goWorkout = new EventEmitter<any[]>();
  // @Output() goBack = new EventEmitter<void>();

  getWorkout() {
    const id = this.activedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    this.routerId = id;
    this.trainingService.getTraining(id).subscribe({
      next: (response) => {
        if (!response) return;
        this.time = formatTime(response.estimatedTime);
        this.selectedTraining = response;
        // this.calculateTime();
      },
      error: console.error,
    });
  }

  backToList() {
    // this.goBack.emit();
  }

  goToWorkout() {
    // this.goWorkout.emit();
  }
}
