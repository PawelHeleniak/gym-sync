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
  providers: [TrainingHistoryService],
})
export class MonthlyStatsCardComponent implements OnInit {
  workoutsMonth: number = 0;
  totalTimeMonth: number = 0;
  totalEstimatedTimeMonth: number = 0;
  streak: number = 0;

  history: WorkoutHistory[] = [];

  constructor(private historyService: TrainingHistoryService) {}

  ngOnInit() {
    this.historyService.getAllHistory().subscribe((data: any[]) => {
      if (!data) return;

      this.history = data;

      this.workoutsMonth = this.getWorkoutCountMonth(data);
      this.totalTimeMonth = this.getTotalTimeMonth(data);
      this.totalEstimatedTimeMonth = this.getTotalEstimatedTimeMonth(data);
      this.streak = this.getWorkoutStreak(data);
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

  getWorkoutStreak(history: any[]) {
    if (!history.length) return 0;

    const uniqueDays = history
      .map((h) => new Date(h.date).toDateString())
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .map((d) => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < uniqueDays.length; i++) {
      const d = new Date(uniqueDays[i]);
      d.setHours(0, 0, 0, 0);

      const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);

      if (diff === streak) streak++;
      else break;
    }

    return streak;
  }

  formatTime(seconds: number) {
    return formatTime(seconds);
  }
}
