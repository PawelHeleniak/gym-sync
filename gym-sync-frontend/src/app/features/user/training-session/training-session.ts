import { Component, Input, OnInit, signal } from '@angular/core';
import { Timer } from './components/timer/timer';
import { Steps } from './components/steps/steps';
import { TrainingService } from './services/training-session.service';

@Component({
  selector: 'app-training-session',
  imports: [Timer, Steps],
  templateUrl: './training-session.html',
  styleUrls: ['./training-session.scss'],
})
export class TrainingSession implements OnInit {
  state: 'list' | 'workout' | 'done' = 'list';
  trainingList: trainingList[] = [];
  currentExerciseIndex: number = 0;
  currentRepIndex: number = 0;
  selectedTraining: trainingList = {
    name: '',
    estimatedTime: 0,
    exercises: [],
  };

  doneExercises = signal<TimeItem[]>([]);

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.getAllTraining();
  }
  getAllTraining() {
    this.trainingService.getAllTrainings().subscribe({
      next: (response: trainingList[]) => {
        if (response) this.trainingList = response;
      },
      error: (err: any) => console.error(err),
    });
  }
  changeStateWorkout(training: trainingList) {
    if (!training._id) return;
    this.trainingService.getTraining(training._id).subscribe({
      next: (response: trainingList) => {
        if (response) {
          this.selectedTraining = response;
          this.state = 'workout';
          this.calculateTime();
        }
      },
      error: (err: any) => console.error(err),
    });
  }

  calculateTime() {
    let time: number;
    const estimatedTime = this.selectedTraining.exercises.map(
      (element) => (time = element.breakTime * element.sets.length)
    );
    estimatedTime.forEach((num) => {
      this.selectedTraining.estimatedTime += num;
    });
  }

  get currentExercise() {
    return this.selectedTraining.exercises[this.currentExerciseIndex];
  }

  get currentRep() {
    return this.currentExercise.sets[this.currentRepIndex];
  }

  handleDoneExercises(data: TimeItem[]) {
    this.doneExercises.set(data);
  }

  backToList() {
    this.state = 'list';
  }
}
