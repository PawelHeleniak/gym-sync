import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TrainingService } from '../training-session/services/training-session.service';
@Component({
  selector: 'app-training-plan-builder',
  imports: [ReactiveFormsModule],
  templateUrl: './training-plan-builder.html',
  styleUrl: './training-plan-builder.scss',
})
export class TrainingPlanBuilder {
  planForm!: FormGroup;
  constructor(private trainingService: TrainingService) {}
  ngOnInit(): void {
    this.planForm = new FormGroup({
      name: new FormControl('', Validators.required),
      estimatedTime: new FormControl(1, Validators.required),
      exercises: new FormArray([
        // new FormGroup({
        //   name: new FormControl('', Validators.required),
        //   breakTime: new FormControl(1, Validators.required),
        //   isRest: new FormControl(false),
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
  addExercise(name: string, breakTime: number, isRest: boolean) {
    const workoutGroup = new FormGroup({
      name: new FormControl(name, Validators.required),
      breakTime: new FormControl(breakTime, Validators.required),
      isRest: new FormControl(isRest),
      sets: new FormArray([]),
    });

    this.exercisesArray.push(workoutGroup);

    if (!isRest) {
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
  addExerciseSet(j: number, repsCount: number, weight: number) {
    console.log(`%c ${j}`, 'color: blue');
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
        console.log(response);
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }
}
