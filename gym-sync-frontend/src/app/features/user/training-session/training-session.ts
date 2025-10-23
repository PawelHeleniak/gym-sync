import { Component, Input, signal } from '@angular/core';
import { Timer } from './components/timer/timer';

@Component({
  selector: 'app-training-session',
  imports: [Timer],
  templateUrl: './training-session.html',
  styleUrls: ['./training-session.scss'],
})
export class TrainingSession {
  public state: 'list' | 'workout' | 'done' = 'list';
  public currentId: number = 0;
  public currentWorkoutStep: number = 0;

  ngOnInit() {
    this.handleInit();
  }
  handleInit() {
    this.trainingList.map((e) => {
      let time: number;
      const estimatedTime = e.workout.map(
        (element) => (time = element.break * element.reps.length)
      );
      estimatedTime.forEach((num) => {
        e.estimatedTime += num;
      });
    });
  }
  selectedTraining: trainingList = {
    name: '',
    estimatedTime: 0,
    id: 0,
    workout: [],
  };
  public trainingList: trainingList[] = [
    {
      name: 'Trening A',
      estimatedTime: 0,
      id: 1,
      workout: [
        {
          name: 'Podciąganie nachwytem',
          break: 120,
          set: 15,
          reps: [
            { count: 1, done: false },
            { count: 2, done: false },
            { count: 3, done: false },
            { count: 4, done: false },
            { count: 5, done: false },
            { count: 6, done: false },
            { count: 7, done: false },
            { count: 8, done: false },
            { count: 7, done: false },
            { count: 6, done: false },
            { count: 5, done: false },
            { count: 4, done: false },
            { count: 3, done: false },
            { count: 2, done: false },
            { count: 1, done: false },
          ],
          weight: 0,
        },
        {
          name: 'Przerwa',
          break: 360,
          set: 1,
          reps: [{ count: 1, done: false }],
          weight: 0,
        },
        {
          name: 'Podciąganie podchwytem',
          break: 120,
          set: 3,
          reps: [
            { count: 9, done: false },
            { count: 8, done: false },
            { count: 6, done: false },
          ],
          weight: 0,
        },
        {
          name: 'Rozpiętki na ziemi',
          break: 120,
          set: 3,
          reps: [
            { count: 9, done: false },
            { count: 8, done: false },
            { count: 6, done: false },
          ],
          weight: 12.5,
        },
      ],
    },
    {
      name: 'Trening B',
      estimatedTime: 0,
      id: 2,
      workout: [
        {
          name: 'Podciąganie podchwytem',
          break: 120,
          set: 3,
          reps: [
            { count: 9, done: false },
            { count: 8, done: false },
            { count: 6, done: false },
          ],
          weight: 0,
        },
      ],
    },
    {
      name: 'Trening C',
      estimatedTime: 0,
      id: 3,
      workout: [
        {
          name: 'Rozpiętki na ziemi',
          break: 120,
          set: 3,
          reps: [
            { count: 9, done: false },
            { count: 8, done: false },
            { count: 6, done: false },
          ],
          weight: 12.5,
        },
      ],
    },
  ];

  currentExerciseIndex = 0;
  currentRepIndex = 0;

  get currentExercise() {
    return this.selectedTraining.workout[this.currentExerciseIndex];
  }

  get currentRep() {
    return this.currentExercise.reps[this.currentRepIndex];
  }

  changeState(id: number, state: 'list' | 'workout' | 'done') {
    this.currentId = id;
    this.state = state;
    this.selectedTraining = this.trainingList.find((t) => t.id === id)!;

    // Timer
    this.timer(this.selectedTraining.workout[this.currentExerciseIndex].break);
  }
  next() {
    this.currentExercise.reps[this.currentRepIndex].done = true;
    if (this.currentExercise.reps.length - 1 > this.currentRepIndex) {
      this.currentRepIndex++;
      this.handleDoneWorkout();
    } else {
      this.handleDoneWorkout();
      this.currentExerciseIndex++;
      this.currentRepIndex = 0;
    }

    // Timer
    this.timer(this.selectedTraining.workout[this.currentExerciseIndex].break);
  }
  handleDoneWorkout() {
    const newItems: any[] = [];

    const currentExercise =
      this.selectedTraining.workout[this.currentExerciseIndex];
    const doneReps = currentExercise.reps.filter((el) => el.done);
    const allDoneCounts = doneReps.map((el) => el.count);
    let finalCount = null;

    if (allDoneCounts.length > 0) {
      finalCount = allDoneCounts.at(-1);
    }
    const getTime = document.querySelector('.timer__time--start')?.textContent;
    if (finalCount)
      newItems.push({
        name: currentExercise.name,
        count: finalCount,
        weight: currentExercise.weight,
        time: getTime,
      });

    this.connectionDoneWorkout.set([
      ...this.connectionDoneWorkout(),
      ...newItems,
    ]);
  }
  connectionDoneWorkout = signal<any[]>([]);
  back() {
    if (this.currentRepIndex !== 0) this.currentRepIndex--;
    else {
      this.currentExerciseIndex--;
      this.currentRepIndex = this.currentExercise.reps.length;
    }
    this.currentExercise.reps[this.currentRepIndex].done = false;

    // Timer
    this.timer(this.selectedTraining.workout[this.currentExerciseIndex].break);
  }
  backToList() {
    this.state = 'list';
  }
  timeLeft: number = 0;
  timerInterval: any;
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
}
