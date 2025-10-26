import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-steps',
  imports: [],
  templateUrl: './steps.html',
  styleUrl: './steps.scss',
})
export class Steps implements OnInit {
  @Input() selectedTraining: trainingList = {
    name: '',
    estimatedTime: 0,
    exercises: [],
  };
  @Output() doneWorkout = new EventEmitter<any[]>();
  @Output() goBack = new EventEmitter<void>();
  connectionDoneWorkout = signal<any[]>([]);

  currentExerciseIndex: number = 0;
  currentRepIndex: number = 0;

  timeLeft: number = 0;
  private timerInterval?: ReturnType<typeof setInterval>;

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
  back() {
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
    this.doneWorkout.emit([...this.connectionDoneWorkout()]);
  }
}
