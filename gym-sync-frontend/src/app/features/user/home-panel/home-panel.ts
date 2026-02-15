import { Component } from '@angular/core';
import { MonthlyStatsCardComponent } from './components/monthly-stats-card/monthly-stats-card';
import { CalendarCard } from './components/calendar-card/calendar-card';

@Component({
  selector: 'app-home-panel',
  imports: [MonthlyStatsCardComponent, CalendarCard],
  templateUrl: './home-panel.html',
  styleUrl: './home-panel.scss',
})
export class HomePanel {}
