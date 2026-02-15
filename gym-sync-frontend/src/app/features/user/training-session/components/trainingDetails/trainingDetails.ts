import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatTime } from '../../../../../shared/utils/time';
import { TrainingList } from '../../../../../shared/models/training.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-training-details',
  imports: [CommonModule],
  templateUrl: './trainingDetails.html',
  styleUrl: './trainingDetails.scss',
})
export class TrainingDetails {
  time: string = '';
  ngOnInit() {
    this.time = formatTime(this.selectedTraining.estimatedTime);
  }
  @Input() stepsView: boolean = false;
  @Input() selectedTraining: TrainingList = {
    name: '',
    estimatedTime: 0,
    exercises: [],
  };
  @Output() goWorkout = new EventEmitter<any[]>();
  @Output() goBack = new EventEmitter<void>();

  backToList() {
    this.goBack.emit();
  }

  goToWorkout() {
    this.goWorkout.emit();
  }
}
