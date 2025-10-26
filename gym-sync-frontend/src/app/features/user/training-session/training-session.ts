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
  public trainingList: trainingList[] = [];
  public estimatedTime: number = 0;
  public selectedTraining: trainingList = {
    name: '',
    estimatedTime: 0,
    exercises: [],
  };

  changeStateWorkout(training: trainingList) {
    if (training._id) {
      this.trainingService.getTraining(training._id).subscribe({
        next: (response: trainingList) => {
          if (response) this.selectedTraining = response;
          this.state = 'workout';

          this.timer(
            this.selectedTraining.exercises[this.currentExerciseIndex].breakTime
          );
          this.handleInit();
        },
        error: (err: any) => {
          console.error(err);
        },
      });
    }
  }
  // public currentId: number = 0;
  // public currentWorkoutStep: number = 0;
  ngOnInit() {
    this.getAllTraining();
  }
  getAllTraining() {
    this.trainingService.getAllTrainings().subscribe({
      next: (response: trainingList[]) => {
        if (response) this.trainingList = response;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }
  handleInit() {
    let time: number;
    const estimatedTime = this.selectedTraining.exercises.map(
      (element) => (time = element.breakTime * element.sets.length)
    );
    estimatedTime.forEach((num) => {
      this.selectedTraining.estimatedTime += num;
    });
  }
  // handleInit() {
  //   this.trainingList.map((e) => {
  //     let time: number;
  //     const estimatedTime = e.exercises.map(
  //       (element) => (time = element.breakTime * element.sets.length)
  //     );
  //     estimatedTime.forEach((num) => {
  //       e.estimatedTime += num;
  //     });
  //   });
  // }

  currentExerciseIndex: number = 0;
  currentRepIndex: number = 0;

  get currentExercise() {
    return this.selectedTraining.exercises[this.currentExerciseIndex];
  }

  get currentRep() {
    return this.currentExercise.sets[this.currentRepIndex];
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

    // Timer
    this.timer(
      this.selectedTraining.exercises[this.currentExerciseIndex].breakTime
    );
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
    if (finalCount)
      newItems.push({
        name: currentExercise.name,
        repsCount: finalCount,
        // weight: currentExercise.weight,
        time: getTime,
        isBreak: currentExercise.isBreak ? currentExercise.isBreak : false,
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
      this.currentRepIndex = this.currentExercise.sets.length;
    }
    this.currentExercise.sets[this.currentRepIndex].done = false;

    // Timer
    this.timer(
      this.selectedTraining.exercises[this.currentExerciseIndex].breakTime
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
