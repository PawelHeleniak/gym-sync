import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-stopwatch-laps',
  imports: [],
  templateUrl: './stopwatch-laps.html',
  styleUrl: './stopwatch-laps.scss',
})
export class StopwatchLaps {
  laps = input.required<StopwatchLap[]>();

  bestLap = computed(() =>
    this.laps().reduce<StopwatchLap | null>((best, lap) => {
      if (!best || this.getLapSeconds(lap.lapTime) < this.getLapSeconds(best.lapTime)) {
        return lap;
      }
      return best;
    }, null),
  );

  private getLapSeconds(time: string): number {
    return time.split(':').reduce((total, part) => total * 60 + Number(part), 0);
  }
}

type StopwatchLap = {
  lap: number;
  overallTime: string;
  lapTime: string;
};
