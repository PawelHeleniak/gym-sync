import { Component } from '@angular/core';
import { MonthlyStatsCardComponent } from './components/monthly-stats-card/monthly-stats-card';
import { CalendarCard } from './components/calendar-card/calendar-card';
import { Charts } from './components/charts/charts';
import { LastTrainingCard } from './components/last-training-card/last-training-card';
import { NextTrainingCard } from './components/next-training-card/next-training-card';

@Component({
  selector: 'app-home-panel',
  imports: [
    MonthlyStatsCardComponent,
    CalendarCard,
    Charts,
    LastTrainingCard,
    NextTrainingCard,
  ],
  templateUrl: './home-panel.html',
  styleUrl: './home-panel.scss',
})
export class HomePanel {
  selectedMonth: Date = new Date();
}
