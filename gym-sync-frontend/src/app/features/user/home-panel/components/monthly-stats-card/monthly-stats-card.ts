import { Component, OnInit } from '@angular/core';
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
export class MonthlyStatsCardComponent implements OnInit {
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
  avergeTimeGeneral: number = 0;

  constructor(private historyService: TrainingHistoryService) {}

  ngOnInit() {
    this.historyService.getAllHistory().subscribe((data: any[]) => {
      if (!data) return;
      console.log(data);
      this.history = data;

      // Miesięczne
      this.workoutsMonth = this.getWorkoutCountMonth(data);
      this.totalTimeMonth = this.getTotalTimeMonth(data);
      this.workoutsDayMonth = this.getWorkoutCountDayMonth(data);
      this.totalEstimatedTimeMonth = this.getTotalEstimatedTimeMonth(data);
      // Ogólne
      this.workoutsGeneral = this.getWorkoutCountGeneral();
      this.streak = this.getWorkoutWeekStreak(data);
    });
  }

  getCurrentMonthWorkouts(history: any[]) {
    const now = new Date();

    return history.filter((item) => {
      const d = new Date(item.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
  }

  getWorkoutCountMonth(history: any[]) {
    return this.getCurrentMonthWorkouts(history).length;
  }

  getWorkoutCountDayMonth(history: any[]) {
    const days = new Set(
      history.map((h) => new Date(h.date).toLocaleDateString('pl-PL')),
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
    if (!history.length) return 0;

    const weeksSet = new Set<string>();

    history.forEach((h) => {
      const date = new Date(h.date);
      const weekKey = this.getWeekKey(date);
      weeksSet.add(weekKey);
    });

    let streak = 0;
    let currentDate = new Date();

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
}
