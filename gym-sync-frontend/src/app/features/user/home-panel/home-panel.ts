import { Component } from '@angular/core';
import { MonthlyStatsCardComponent } from './components/monthly-stats-card/monthly-stats-card';
import { CalendarCard } from './components/calendar-card/calendar-card';
import { Charts } from './components/charts/charts';

@Component({
  selector: 'app-home-panel',
  imports: [MonthlyStatsCardComponent, CalendarCard, Charts],
  templateUrl: './home-panel.html',
  styleUrl: './home-panel.scss',
})
export class HomePanel {}
