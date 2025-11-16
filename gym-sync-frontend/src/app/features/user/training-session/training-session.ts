import {
  Component,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Timer } from './components/timer/timer';
import { Steps } from './components/steps/steps';
import { TrainingService } from '../../../shared/services/training-session.service';
import { TrainingDetails } from './components/trainingDetails/trainingDetails';
import { TrainingList } from '../../../shared/models/training.model';
import { TimeItem } from './models/training-session.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrainingPlanBuilder } from '../training-plan-builder/training-plan-builder';
type TrainingState =
  | 'trainingList'
  | 'trainingDetails'
  | 'trainingActive'
  | 'trainingSummary'
  | 'trainingEdit';

@Component({
  selector: 'app-training-session',
  imports: [Timer, Steps, TrainingDetails, TrainingPlanBuilder],
  templateUrl: './training-session.html',
  styleUrls: ['./training-session.scss'],
})
export class TrainingSession implements OnInit {
  state: TrainingState = 'trainingList';

  trainingList: TrainingList[] = [];
  currentExerciseIndex: number = 0;
  currentRepIndex: number = 0;
  selectedTraining: TrainingList = {
    name: '',
    estimatedTime: 0,
    exercises: [],
  };

  private _snackBar = inject(MatSnackBar);
  durationInSeconds: number = 3000;

  doneExercises = signal<TimeItem[]>([]);
  @ViewChild('timer') timerComponent!: Timer;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.getAllTraining();
  }
  getAllTraining() {
    this.trainingService.getAllTrainings().subscribe({
      next: (response: TrainingList[]) => {
        if (response) this.trainingList = response;
      },
      error: (err: any) => console.error(err),
    });
  }
  changeStateWorkout(training: TrainingList, state: TrainingState) {
    if (!training._id) return;
    this.trainingService.getTraining(training._id).subscribe({
      next: (response: TrainingList) => {
        if (response) {
          this.selectedTraining = response;
          this.state = state;
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
  removeTraining(id: string) {
    this.trainingService.removeTraining(id).subscribe({
      next: (response: TrainingList) => {
        if (response) {
          this.getAllTraining();
          this.openSnackBar('Usunięcie powiodło się', 'success');
        }
      },
      error: (err: any) => {
        this.openSnackBar(
          'Usunięcie nie powiodło się, spróbuj ponownie.',
          'warning'
        );
        console.error(err);
      },
    });
  }
  editTraining(training: TrainingList) {
    this.changeStateWorkout(training, 'trainingEdit');
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

  goToWorkout() {
    this.state = 'trainingActive';
  }

  backToList() {
    this.state = 'trainingList';
    this.doneExercises.set([]);
  }
  stopTimer() {
    this.timerComponent.stop();
  }
  openSnackBar(message: string, mode: string) {
    console.log(message);
    console.log(mode);
    if (mode === 'success') {
      this._snackBar.open(message, '', {
        duration: this.durationInSeconds,
        panelClass: ['snackbar', 'snackbar--success'],
      });
    } else if (mode === 'warning') {
      this._snackBar.open(message, '', {
        duration: this.durationInSeconds,
        panelClass: ['snackbar', 'snackbar--warning'],
      });
    }
  }
}
