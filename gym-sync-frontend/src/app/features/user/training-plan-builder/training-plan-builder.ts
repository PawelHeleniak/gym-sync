import { Component, inject, Input } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TrainingService } from '../../../shared/services/training-session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TrainingList } from '../../../shared/models/training.model';

@Component({
  selector: 'app-training-plan-builder',
  imports: [ReactiveFormsModule],
  templateUrl: './training-plan-builder.html',
  styleUrl: './training-plan-builder.scss',
})
export class TrainingPlanBuilder {
  @Input() existingPlan: TrainingList | undefined;

  planForm!: FormGroup;
  private _snackBar = inject(MatSnackBar);
  durationInSeconds: number = 3000;

  constructor(
    private trainingService: TrainingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.planForm = new FormGroup({
      name: new FormControl('', Validators.required),
      estimatedTime: new FormControl(1, Validators.required),
      day: new FormControl(0, Validators.required),
      exercises: new FormArray([]),
    });
    if (this.existingPlan) {
      this.loadingExistingPlan(this.existingPlan);
    }
  }

  get exercisesArray(): FormArray {
    return this.planForm.get('exercises') as FormArray;
  }

  getExercise(i: number): FormGroup {
    return this.exercisesArray.at(i) as FormGroup;
  }
  getSets(exerciseIndex: number): FormArray {
    return this.getExercise(exerciseIndex).get('sets') as FormArray;
  }

  loadingExistingPlan(plan: TrainingList) {
    this.planForm.get('name')?.setValue(plan.name);
    plan.day
      ? this.planForm.get('day')?.setValue(plan.day)
      : this.planForm.get('day')?.setValue(0);
    console.log(plan);
    plan.exercises.forEach((exercise, idx) => {
      this.addExercise(
        exercise.name,
        exercise.breakTime,
        exercise.isBreak ?? false,
        exercise.comment ?? '',
      );

      const sets = this.getSets(idx);
      sets.clear();

      if (!Array.isArray(exercise.sets)) return;

      exercise.sets.forEach((set) => {
        this.addExerciseSet(idx, set.repsCount ?? 0, set.weight ?? 0);
      });
    });
  }

  addExercise(
    name: string,
    breakTime: number,
    isBreak: boolean,
    comment: string,
  ) {
    const workoutGroup = new FormGroup({
      name: new FormControl(name, Validators.required),
      breakTime: new FormControl(breakTime, Validators.required),
      isBreak: new FormControl(isBreak),
      sets: new FormArray([]),
      comment: new FormControl(comment, Validators.required),
    });

    this.exercisesArray.push(workoutGroup);

    if (!isBreak) {
      const newIndex = this.exercisesArray.length - 1;
      this.addExerciseSet(newIndex, 1, 0);
    } else {
      const newIndex = this.exercisesArray.length - 1;
      this.addExerciseSet(newIndex, 1, 0);
    }
  }
  removeExercise(i: number) {
    this.exercisesArray.removeAt(i);
  }
  addExerciseSetButton(j: number) {
    console.log(`%c ${j}`, 'color: blue');
    const workout = this.exercisesArray.at(j) as FormGroup;
    const repsArray = workout.get('sets') as FormArray;

    this.addExerciseSet(
      j,
      repsArray.at(-1).value.repsCount,
      repsArray.at(-1).value.weight,
    );
  }
  addExerciseSet(j: number, repsCount: number, weight: number) {
    console.log(`%c ${j}`, 'color: purple');
    const workout = this.exercisesArray.at(j) as FormGroup;
    const repsArray = workout.get('sets') as FormArray;

    const repGroup = new FormGroup({
      repsCount: new FormControl(repsCount, Validators.required),
      weight: new FormControl(weight),
      done: new FormControl(false),
    });

    repsArray.push(repGroup);
  }
  removeExerciseSet(exerciseIndex: number, setIndex: number) {
    const sets = this.getSets(exerciseIndex);
    sets.removeAt(setIndex);
  }

  addPlanForm(): void {
    this.trainingService.addTraining(this.planForm.value).subscribe({
      next: (response) => {
        this.openSnackBar('Pomyślnie dodano trening.', 'success');
        this.router.navigate(['/trening']);
        console.log(response);
      },
      error: (err: any) => {
        this.openSnackBar(
          'Nie udało się dodać trening, spróbuj ponownie.',
          'warning',
        );
        console.error(err);
      },
    });
  }
  updateTraining() {
    console.log(this.planForm);
    this.trainingService
      .updateTraining(this.planForm.value, this.existingPlan?._id)
      .subscribe({
        next: (response) => {
          this.openSnackBar('Pomyślnie zaktualizowano trening.', 'success');
          console.log(response);
        },
        error: (err) => {
          this.openSnackBar(
            'Nie udało zaktualizować się treningu, spróbuj ponownie.',
            'warning',
          );
          console.error(err);
        },
      });
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
