import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingHistoryService } from '../../../../../shared/services/training-history.service';
import { formatTime } from '../../../../../shared/utils/time';

import { WorkoutHistory } from '../../../../../shared/models/trainingHistory.model';

@Component({
  selector: 'app-monthly-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-stats-card.html',
  styleUrl: './monthly-stats-card.scss',
  providers: [TrainingHistoryService],
})
export class MonthlyStatsCardComponent implements OnInit, OnChanges {
  @Input() selectedMonth: Date = new Date();
  history: WorkoutHistory[] = [];

  // Miesięczne
  workoutsMonth: number = 0;
  totalTimeMonth: number = 0;
  workoutsDayMonth: number = 0;
  totalEstimatedTimeMonth: number = 0;
  // Ogólne
  workoutsGeneral: number = 0;
  totalTimeGeneral: number = 0;
  streak: number = 0;
  isStreakPending: boolean = false;
  avergeTimeGeneral: number = 0;

  constructor(private historyService: TrainingHistoryService) {}

  ngOnInit() {
    this.historyService.getAllHistory().subscribe((data: any[]) => {
      if (!data) return;
      // console.log(data);
      this.history = data;

      // Miesięczne
      this.updateMonthlyStats();
      // Ogólne
      this.workoutsGeneral = this.getWorkoutCountGeneral();
      this.totalTimeGeneral = this.getTotalTimeGeneral();
      this.avergeTimeGeneral =
        this.workoutsGeneral > 0
          ? Math.round(this.totalTimeGeneral / this.workoutsGeneral)
          : 0;
      this.streak = this.getWorkoutWeekStreak(data);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMonth']) this.updateMonthlyStats();
  }

  private updateMonthlyStats(): void {
    this.workoutsMonth = this.getWorkoutCountMonth(this.history);
    this.totalTimeMonth = this.getTotalTimeMonth(this.history);
    this.workoutsDayMonth = this.getWorkoutCountDayMonth(this.history);
    this.totalEstimatedTimeMonth = this.getTotalEstimatedTimeMonth(
      this.history,
    );
  }

  getCurrentMonthWorkouts(history: any[]) {
    const month = this.selectedMonth;

    return history.filter((item) => {
      const d = new Date(item.date);
      return (
        d.getMonth() === month.getMonth() &&
        d.getFullYear() === month.getFullYear()
      );
    });
  }

  getWorkoutCountMonth(history: any[]) {
    return this.getCurrentMonthWorkouts(history).length;
  }

  getWorkoutCountDayMonth(history: any[]) {
    const days = new Set(
      this.getCurrentMonthWorkouts(history).map((h) =>
        new Date(h.date).toLocaleDateString('pl-PL'),
      ),
    );

    return days.size;
  }

  getTotalTimeMonth(history: any[]) {
    return this.getCurrentMonthWorkouts(history).reduce(
      (sum, el) => sum + Number(el.totalTime || 0),
      0,
    );
  }

  getTotalEstimatedTimeMonth(history: any[]) {
    return this.getCurrentMonthWorkouts(history).reduce(
      (sum, el) => sum + Number(el.estimatedTime || 0),
      0,
    );
  }

  getWorkoutWeekStreak(history: WorkoutHistory[]) {
    this.isStreakPending = false;
    if (!history.length) return 0;

    const weeksSet = new Set<string>();

    history.forEach((h) => {
      const date = new Date(h.date);
      const weekKey = this.getWeekKey(date);
      weeksSet.add(weekKey);
    });

    let streak = 0;
    const currentDate = new Date();

    if (!weeksSet.has(this.getWeekKey(currentDate))) {
      currentDate.setDate(currentDate.getDate() - 7);
      this.isStreakPending = weeksSet.has(this.getWeekKey(currentDate));
    }

    while (true) {
      const key = this.getWeekKey(currentDate);

      if (weeksSet.has(key)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 7);
      } else {
        break;
      }
    }

    return streak;
  }

  formatTime(seconds: number) {
    return formatTime(seconds);
  }

  private getWeekKey(date: Date) {
    const d = new Date(date);

    const day = d.getDay() || 7;
    if (day !== 1) {
      d.setDate(d.getDate() - day + 1);
    }

    const year = d.getFullYear();
    const week = this.getWeekNumber(d);

    return `${year}-W${week}`;
  }

  private getWeekNumber(date: Date) {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;

    d.setUTCDate(d.getUTCDate() + 4 - dayNum);

    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  // Ogólne
  getWorkoutCountGeneral() {
    return this.history.length;
  }

  getTotalTimeGeneral() {
    return this.history.reduce(
      (sum, item) => sum + Number(item.totalTime || 0),
      0,
    );
  }
}
