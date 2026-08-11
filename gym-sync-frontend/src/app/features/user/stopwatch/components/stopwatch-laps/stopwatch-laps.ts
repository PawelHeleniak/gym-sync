import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stopwatch-laps',
  imports: [],
  templateUrl: './stopwatch-laps.html',
  styleUrl: './stopwatch-laps.scss',
})
export class StopwatchLaps {
  laps = input.required<StopwatchLap[]>();
}

type StopwatchLap = {
  lap: number;
  overallTime: string;
  lapTime: string;
};
