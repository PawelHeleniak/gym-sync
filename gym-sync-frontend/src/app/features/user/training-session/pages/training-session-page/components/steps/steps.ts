import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrainingService } from '../../../../../../../shared/services/training-session.service';
import { TrainingHistoryService } from '../../../../../../../shared/services/training-history.service';
import { TrainingList } from '../../../../../../../shared/models/training.model';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatTime } from '../../../../../../../shared/utils/time';
import { TimeItem } from '../../../../models/training-session.model';

@Component({
  selector: 'app-steps',
  imports: [FormsModule, CommonModule],
  templateUrl: './steps.html',
  styleUrl: './steps.scss',
})
export class Steps implements OnInit, OnDestroy {
  selectedTraining: TrainingList = {
    name: '',
    estimatedTime: 0,
    exercises: [],
  };
  loading = true;
  @Input() elapsedSeconds = 0;
  @Output() workoutReady = new EventEmitter<number>();
  @Output() doneWorkout = new EventEmitter<TimeItem[]>();
  @Output() goBack = new EventEmitter<void>();
  @Output() stop = new EventEmitter<void>();
  @Output() lastStep = new EventEmitter<void>();
  connectionDoneWorkout = signal<TimeItem[]>([]);

  currentExerciseIndex: number = 0;
  currentRepIndex: number = 0;

  timeLeft: number = 0;
  timeLeftFromatted: string = '00:00';
  intervalState: boolean = false;
  endTraining: boolean = false;
  endTrainingTime: string = '';
  private timerInterval?: ReturnType<typeof setInterval>;
  comment: string = '';

  durationInSeconds = 3000;

  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  constructor(
    private trainingService: TrainingService,
    private trainingHistoryService: TrainingHistoryService,
  ) {}
  ngOnInit() {
    this.getWorkout();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  getWorkout(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }

    this.trainingService
      .getTraining(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (training) => {
          const exercises = training?.exercises;
          if (
            exercises?.length &&
            exercises.every((exercise) => exercise.sets?.length)
          ) {
            this.selectedTraining = training;
            this.timer(exercises[0].breakTime || 0);
            this.workoutReady.emit(training.estimatedTime ?? 0);
          }
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
        },
      });
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
    this.timeLeftFromatted = formatTime(this.timeLeft, true);

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.timeLeftFromatted = formatTime(this.timeLeft, true);

        if (
          this.timeLeft === 0 &&
          this.currentExercise.sets[this.currentRepIndex].timeCount !== 0 &&
          !this.intervalState
        ) {
          this.intervalState = true;
          this.timer(this.currentExercise.sets[this.currentRepIndex].timeCount);
        }
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
  next() {
    this.currentExercise.sets[this.currentRepIndex].done = true;
    this.handleDoneWorkout();
    if (this.currentExercise.sets.length - 1 > this.currentRepIndex) {
      this.currentRepIndex++;
    } else {
      this.currentExerciseIndex++;
      this.currentRepIndex = 0;
    }
    this.intervalState = false;
    this.timer(this.currentExercise.breakTime || 0);
  }
  hanldeEndTraining() {
    this.endTraining = true;
    clearInterval(this.timerInterval);
    this.stop.emit();
    this.endTrainingTime = formatTime(this.elapsedSeconds);

    this.emitLastStep();
    this.handleDoneWorkout();
    this.updateTraining(this.elapsedSeconds);
  }
  updateTraining(totalTime: number) {
    this.selectedTraining.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        set.done = false;
      });
    });
    this.selectedTraining.estimatedTime = 0;
    this.trainingService.updateTraining(this.selectedTraining).subscribe({
      next: (response) => {
        this.saveHistory(response.workout, totalTime);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  saveHistory(plan: TrainingList, totalTime: number) {
    const finished = {
      planId: plan._id,
      totalTime,
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
    this.intervalState = false;

    if (this.currentRepIndex !== 0) this.currentRepIndex--;
    else {
      this.currentExerciseIndex--;
      this.currentRepIndex =
        this.selectedTraining.exercises[this.currentExerciseIndex].sets.length -
        1;
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
    const currentExercise = this.currentExercise;
    const set = this.currentRep;
    const item: TimeItem = {
      name: currentExercise.name,
      repsCount: set.repsCount,
      timeCount: set.timeCount,
      weight: set.weight,
      time: formatTime(this.elapsedSeconds),
      isBreak: currentExercise.isBreak ? currentExercise.isBreak : false,
      breakTime: currentExercise.breakTime ? currentExercise.breakTime : 0,
      type:
        currentExercise.type ?? (currentExercise.isBreak ? 'break' : 'reps'),
    };

    this.connectionDoneWorkout.set([...this.connectionDoneWorkout(), item]);
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
