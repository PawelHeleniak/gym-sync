import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-training-plan-builder',
  imports: [ReactiveFormsModule],
  templateUrl: './training-plan-builder.html',
  styleUrl: './training-plan-builder.scss',
})
export class TrainingPlanBuilder {
  planForm!: FormGroup;
  private _snackBar = inject(MatSnackBar);
  durationInSeconds: number = 3000;
  user: any;
  constructor(
    private trainingService: TrainingService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.planForm = new FormGroup({
      name: new FormControl('', Validators.required),
      estimatedTime: new FormControl(1, Validators.required),
      exercises: new FormArray([
        // new FormGroup({
        //   name: new FormControl('', Validators.required),
        //   breakTime: new FormControl(1, Validators.required),
        //   isBreak: new FormControl(false),
        //   sets: new FormArray([
        //     new FormGroup({
        //       repsCount: new FormControl(1, Validators.required),
        //       weight: new FormControl(1),
        //       done: new FormControl(false, Validators.required),
        //     }),
        //   ]),
        // }),
      ]),
    });
  }
  get exercisesArray(): FormArray {
    return this.planForm.get('exercises') as FormArray;
  }
  get setsArray(): FormArray {
    return this.planForm.get('sets') as FormArray;
  }
  addExercise(name: string, breakTime: number, isBreak: boolean) {
    const workoutGroup = new FormGroup({
      name: new FormControl(name, Validators.required),
      breakTime: new FormControl(breakTime, Validators.required),
      isBreak: new FormControl(isBreak),
      sets: new FormArray([]),
      comment: new FormControl('', Validators.required),
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
  getSets(i: number): FormArray {
    return this.exercisesArray.at(i).get('sets') as FormArray;
  }
  addExerciseSetButton(j: number) {
    console.log(`%c ${j}`, 'color: blue');
    const workout = this.exercisesArray.at(j) as FormGroup;
    const repsArray = workout.get('sets') as FormArray;

    this.addExerciseSet(
      j,
      repsArray.at(-1).value.repsCount,
      repsArray.at(-1).value.weight
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
        this.openSnackBar('Pomyślnie dodano trening');
        this.router.navigate(['/trening']);
        console.log(response);
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds,
      panelClass: ['snackbar', 'snackbar--success'],
    });
  }
}
