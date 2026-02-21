import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingHistoryService } from '../../../../../shared/services/training-history.service';
import { TrainingService } from '../../../../../shared/services/training-session.service';

import { WorkoutHistory } from '../../../../../shared/models/trainingHistory.model';
import { TrainingList } from '../../../../../shared/models/training.model';

type CalendarDay = {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isWorkoutDay: boolean;
  isPlanWorkoutDay: boolean;
  isToday: boolean;
};
type Legend = {
  text: string;
  color: string;
};
@Component({
  selector: 'app-calendar-card',
  imports: [CommonModule],
  templateUrl: './calendar-card.html',
  styleUrl: './calendar-card.scss',
})
export class CalendarCard implements OnInit {
  history: WorkoutHistory[] = [];
  training: number[] = [];
  currentDate = new Date();
  days: CalendarDay[] = [];

  weekDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];
  legend: Legend[] = [
    {
      text: 'Bieżący dzień',
      color: 'var(--accent)',
    },
    {
      text: 'Zrealizowany trening',
      color: 'var(--primary)',
    },
    {
      text: 'Zaplanowany trening',
      color: 'var(--color-btn-secondary)',
    },
  ];
  constructor(
    private historyService: TrainingHistoryService,
    private trainingService: TrainingService,
  ) {}

  ngOnInit() {
    this.historyService.getAllHistory().subscribe((data) => {
      this.history = data;
      this.generateCalendar();
    });
    this.trainingService.getWorkoutDays().subscribe((data) => {
      this.training = data;
    });
  }

  get monthName() {
    return this.currentDate.toLocaleDateString('pl-PL', {
      month: 'long',
      year: 'numeric',
    });
  }

  prevMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1,
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1,
    );
    this.generateCalendar();
  }

  generateCalendar() {
    const workoutDays = this.getWorkoutDaysSet();
    const today = new Date();

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();

    let startDay = firstDayOfMonth.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    const days: CalendarDay[] = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: d,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isWorkoutDay: workoutDays.has(d.toDateString()),
        isPlanWorkoutDay: false,
        isToday: this.isSameDay(d, today),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const plannedDays = this.getPlanWorkoutDaysSet(d);

      days.push({
        date: d,
        dayNumber: day,
        isCurrentMonth: true,
        isWorkoutDay: workoutDays.has(d.toDateString()),
        isPlanWorkoutDay: plannedDays,
        isToday: this.isSameDay(d, today),
      });
    }

    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({
          date: d,
          dayNumber: d.getDate(),
          isCurrentMonth: false,
          isWorkoutDay: workoutDays.has(d.toDateString()),
          isPlanWorkoutDay: false,
          isToday: this.isSameDay(d, today),
        });
      }
    }

    this.days = days;
  }

  private isSameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }
  private getWorkoutDaysSet(): Set<string> {
    return new Set(this.history.map((h) => new Date(h.date).toDateString()));
  }
  private getPlanWorkoutDaysSet(d: any) {
    const day = d.getDay();

    const checkDay = this.training.some((e) => {
      return e !== 0 && day === e;
    });
    return checkDay;
  }
}
