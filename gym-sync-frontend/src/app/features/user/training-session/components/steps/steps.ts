import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { TrainingDetails } from '../trainingDetails/trainingDetails';
import { FormsModule } from '@angular/forms';
import { TrainingService } from '../../../../../shared/services/training-session.service';
import { TrainingHistoryService } from '../../../../../shared/services/training-history.service';
import { TrainingList } from '../../../../../shared/models/training.model';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-steps',
  imports: [TrainingDetails, FormsModule, CommonModule],
  templateUrl: './steps.html',
  styleUrl: './steps.scss',
})
export class Steps implements OnInit {
  @Input() selectedTraining: TrainingList = {
    name: '',
    estimatedTime: 0,
    exercises: [],
  };
  @Output() doneWorkout = new EventEmitter<any[]>();
  @Output() goBack = new EventEmitter<void>();
  @Output() stop = new EventEmitter<void>();
  @Output() lastStep = new EventEmitter<void>();
  connectionDoneWorkout = signal<any[]>([]);

  currentExerciseIndex: number = 0;
  currentRepIndex: number = 0;

  timeLeft: number = 0;
  endTraining: boolean = false;
  endTrainingTime: string = '';
  private timerInterval?: ReturnType<typeof setInterval>;
  comment: string = '';

  durationInSeconds = 3000;

  private snackBar = inject(MatSnackBar);

  constructor(
    private trainingService: TrainingService,
    private trainingHistoryService: TrainingHistoryService,
  ) {}
  ngOnInit() {
    const firstExercise = this.selectedTraining.exercises[0];
    if (firstExercise) this.timer(firstExercise.breakTime || 0);
  }

  get currentExercise() {
    return this.selectedTraining.exercises[this.currentExerciseIndex];
  }

  get currentRep() {
    return this.currentExercise.sets[this.currentRepIndex];
  }

  get isLastStep() {
    return (
      this.currentExerciseIndex ===
        this.selectedTraining.exercises.length - 1 &&
      this.currentRepIndex ===
        this.selectedTraining.exercises[this.currentExerciseIndex].sets.length -
          1
    );
  }

  timer(time: number) {
    this.timeLeft = time;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
  next() {
    this.currentExercise.sets[this.currentRepIndex].done = true;
    if (this.currentExercise.sets.length - 1 > this.currentRepIndex) {
      this.currentRepIndex++;
      this.handleDoneWorkout();
    } else {
      this.handleDoneWorkout();
      this.currentExerciseIndex++;
      this.currentRepIndex = 0;
    }

    this.timer(this.currentExercise.breakTime || 0);
  }
  hanldeEndTraining() {
    this.endTraining = true;
    this.stop.emit();

    const getTime = document.querySelector('.timer__time--start')?.textContent;
    this.endTrainingTime = getTime ? getTime : '';

    this.emitLastStep();
    this.handleDoneWorkout();
    this.updateTraining();
  }
  updateTraining() {
    this.selectedTraining.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        set.done = false;
      });
    });
    this.selectedTraining.estimatedTime = 0;
    this.trainingService.updateTraining(this.selectedTraining).subscribe({
      next: (response) => {
        this.saveHistory(response.workout);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  toSeconds(time: string): number {
    const [h, m, s] = time.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  }
  saveHistory(plan: TrainingList) {
    const finished = {
      planId: plan._id,
      totalTime: this.toSeconds(this.endTrainingTime),
      estimatedTime: plan.estimatedTime,
      exercises: plan.exercises,
    };
    this.trainingHistoryService.addHistoryTraining(finished).subscribe({
      next: () => {
        this.openSnackBar('Trening zakończony', 'success');
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  back() {
    this.removeLastDoneWorkout();

    if (this.currentRepIndex !== 0) this.currentRepIndex--;
    else {
      this.currentExerciseIndex--;
      this.currentRepIndex = this.currentExercise.sets.length;
    }
    this.currentExercise.sets[this.currentRepIndex].done = false;

    this.timer(this.currentExercise.breakTime || 0);
  }
  backToList() {
    clearInterval(this.timerInterval);
    this.goBack.emit();
  }
  private emitLastStep() {
    this.lastStep.emit();
  }
  handleDoneWorkout() {
    const newItems: any[] = [];

    const currentExercise =
      this.selectedTraining.exercises[this.currentExerciseIndex];
    const doneSets = currentExercise.sets.filter((el) => el.done);
    const allDoneCounts = doneSets.map((el) => el.repsCount);
    let finalCount = null;

    if (allDoneCounts.length > 0) {
      finalCount = allDoneCounts.at(-1);
    }
    const getTime = document.querySelector('.timer__time--start')?.textContent;
    if (finalCount) console.log(currentExercise);
    newItems.push({
      name: currentExercise.name,
      repsCount: finalCount,
      weight: currentExercise.sets[this.currentRepIndex].weight,
      time: getTime,
      isBreak: currentExercise.isBreak ? currentExercise.isBreak : false,
      breakTime: currentExercise.breakTime ? currentExercise.breakTime : 0,
    });

    this.connectionDoneWorkout.set([
      ...this.connectionDoneWorkout(),
      ...newItems,
    ]);
    this.doneWorkout.emit([...this.connectionDoneWorkout()]);
  }

  private removeLastDoneWorkout() {
    const list = [...this.connectionDoneWorkout()];
    list.pop();
    this.connectionDoneWorkout.set(list);
    this.doneWorkout.emit(list);
  }

  openSnackBar(message: string, mode: 'success' | 'warning') {
    this.snackBar.open(message, '', {
      duration: this.durationInSeconds,
      panelClass: ['snackbar', `snackbar--${mode}`],
    });
  }
}
