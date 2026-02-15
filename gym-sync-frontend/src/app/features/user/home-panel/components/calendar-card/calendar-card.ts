import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingHistoryService } from '../../../../../shared/services/training-history.service';

import { WorkoutHistory } from '../../../../../shared/models/trainingHistory.model';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isWorkoutDay: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-calendar-card',
  imports: [CommonModule],
  templateUrl: './calendar-card.html',
  styleUrl: './calendar-card.scss',
})
export class CalendarCard implements OnInit {
  history: WorkoutHistory[] = [];
  currentDate = new Date();
  days: CalendarDay[] = [];

  weekDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];

  constructor(private historyService: TrainingHistoryService) {}

  ngOnInit() {
    this.historyService.getAllHistory().subscribe((data) => {
      this.history = data;
      this.generateCalendar();
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
        isToday: this.isSameDay(d, today),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      days.push({
        date: d,
        dayNumber: day,
        isCurrentMonth: true,
        isWorkoutDay: workoutDays.has(d.toDateString()),
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
  private getWorkoutDaysSet() {
    return new Set(this.history.map((h) => new Date(h.date).toDateString()));
  }
}
