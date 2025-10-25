import { Component, Input, signal } from '@angular/core';
import { Timer } from './components/timer/timer';
import { TrainingService } from './services/training-session.service';

@Component({
  selector: 'app-training-session',
  imports: [Timer],
  templateUrl: './training-session.html',
  styleUrls: ['./training-session.scss'],
})
export class TrainingSession {
  constructor(private trainingService: TrainingService) {}

  public state: 'list' | 'workout' | 'done' = 'list';
  public currentId: number = 0;
  public currentWorkoutStep: number = 0;
  ngOnInit() {
    this.handleInit();
    this.loadTrainings();

    this.getAllTraining();
  }
  getAllTraining() {
    this.trainingService.getAllTrainings().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }
  async loadTrainings() {
    try {
      this.trainingList = await this.trainingService.getTrainings();
      this.handleInit();
    } catch (error) {
      console.error(error);
    }
  }
  handleInit() {
    this.trainingList.map((e) => {
      let time: number;
      const estimatedTime = e.workout.map(
        (element) => (time = element.breakTime * element.reps.length)
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
  public trainingList: trainingList[] = [];

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
    this.timer(
      this.selectedTraining.workout[this.currentExerciseIndex].breakTime
    );
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
    this.timer(
      this.selectedTraining.workout[this.currentExerciseIndex].breakTime
    );
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
        break: currentExercise.break ? currentExercise.break : false,
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
    this.timer(
      this.selectedTraining.workout[this.currentExerciseIndex].breakTime
    );
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
