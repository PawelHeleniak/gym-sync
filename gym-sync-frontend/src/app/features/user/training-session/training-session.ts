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
import { formatTime } from '../../../shared/utils/time';
import { KeyValuePipe } from '@angular/common';

type TrainingState =
  | 'trainingList'
  | 'trainingDetails'
  | 'trainingActive'
  | 'trainingSummary'
  | 'trainingEdit';

type TrainingsByDay = Record<number, TrainingList[]>;

@Component({
  selector: 'app-training-session',
  imports: [Timer, Steps, TrainingDetails, TrainingPlanBuilder, KeyValuePipe],
  templateUrl: './training-session.html',
  styleUrls: ['./training-session.scss'],
})
export class TrainingSession implements OnInit {
  state: TrainingState = 'trainingList';

  trainingList: TrainingList[] = [];
  trainingListTest: TrainingsByDay = {};

  selectedTraining: TrainingList = {
    name: '',
    estimatedTime: 0,
    exercises: [],
  };

  currentExerciseIndex = 0;
  currentRepIndex = 0;

  viewMode: 'all' | 'days' = 'all';

  listHeader: Record<number, string> = {
    0: 'Brak przypisanego dnia',
    1: 'Poniedziałek',
    2: 'Wtorek',
    3: 'Środa',
    4: 'Czwartek',
    5: 'Piątek',
    6: 'Sobota',
    7: 'Niedziela',
  };

  doneExercises = signal<TimeItem[]>([]);
  durationInSeconds = 3000;
  isLastStep = false;

  @ViewChild('timer') timerComponent!: Timer;

  private snackBar = inject(MatSnackBar);

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.getAllTraining();
  }

  getAllTraining() {
    this.trainingService.getAllTrainings().subscribe({
      next: (response) => {
        if (!response) return;

        this.trainingList = response
          .slice()
          .sort((a, b) => Number(!!b.badge) - Number(!!a.badge));

        this.trainingListTest = this.groupByDay(this.trainingList);
      },
      error: console.error,
    });
  }

  changeStateWorkout(training: TrainingList, state: TrainingState) {
    if (!training._id) return;

    this.trainingService.getTraining(training._id).subscribe({
      next: (response) => {
        if (!response) return;

        this.selectedTraining = response;
        this.state = state;
        this.calculateTime();
      },
      error: console.error,
    });
  }

  calculateTime() {
    this.selectedTraining.estimatedTime =
      this.selectedTraining.exercises.reduce(
        (sum, ex) => sum + ex.breakTime * ex.sets.length,
        0,
      );
  }

  removeTraining(id: string) {
    this.trainingService.removeTraining(id).subscribe({
      next: () => {
        this.getAllTraining();
        this.openSnackBar('Usunięcie powiodło się', 'success');
      },
      error: (err) => {
        this.openSnackBar(
          'Usunięcie nie powiodło się, spróbuj ponownie.',
          'warning',
        );
        console.error(err);
      },
    });
  }

  editTraining(training: TrainingList) {
    this.changeStateWorkout(training, 'trainingEdit');
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
  handleLastStep() {
    this.isLastStep = true;
  }
  stopTimer() {
    this.timerComponent.stop();
  }

  toggleBadge(training: TrainingList, id: string) {
    training.badge = !training.badge;

    this.trainingService.updateTraining(training, id).subscribe({
      next: () => {
        this.openSnackBar(
          training.badge ? 'Dodano do ulubionych.' : 'Usunięto z ulubionych.',
          'success',
        );
        this.getAllTraining();
      },
      error: (err) => {
        this.openSnackBar('Nie udało się dodać do ulubionych.', 'warning');
        console.error(err);
      },
    });
  }

  toggleView() {
    this.viewMode = this.viewMode === 'all' ? 'days' : 'all';
    localStorage.setItem('trainingSessionViewMode', this.viewMode);
  }

  formatEstimatedTime(time: number): string {
    return formatTime(time);
  }

  groupByDay(trainings: TrainingList[]): TrainingsByDay {
    return trainings.reduce((acc, training) => {
      const day = training.day ?? 0;
      acc[day] ??= [];
      acc[day].push(training);
      return acc;
    }, {} as TrainingsByDay);
  }

  getHeaderForDay(day: string): string {
    return this.listHeader[Number(day)];
  }

  openSnackBar(message: string, mode: 'success' | 'warning') {
    this.snackBar.open(message, '', {
      duration: this.durationInSeconds,
      panelClass: ['snackbar', `snackbar--${mode}`],
    });
  }
}
