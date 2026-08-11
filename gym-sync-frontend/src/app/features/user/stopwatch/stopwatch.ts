import { Component } from '@angular/core';
import { StopwatchLaps } from './components/stopwatch-laps/stopwatch-laps';

@Component({
  selector: 'app-stopwatch',
  imports: [StopwatchLaps],
  templateUrl: './stopwatch.html',
  styleUrl: './stopwatch.scss',
})
export class Stopwatch {
  // Możliwe stany: 'init', 'running', 'paused'
  state: 'init' | 'running' | 'paused' = 'init';

  laps: StopwatchLap[] = [
    { lap: 1, overallTime: '00:01.01', lapTime: '00:00.00' },
    { lap: 2, overallTime: '00:02.02', lapTime: '00:01.01' },
    { lap: 3, overallTime: '00:03.03', lapTime: '00:01.01' },
    { lap: 4, overallTime: '00:04.04', lapTime: '00:01.01' },
    { lap: 5, overallTime: '00:05.05', lapTime: '00:01.01' },
  ];

  elapsedMs: number = 3595000;
  hours: boolean = false;

  stopwatchInterval: any;

  handleStart(): void {
    this.state = 'running';
    this.interval();
  }

  handlePause(): void {
    this.state = 'paused';
    this.stopInterval();
  }

  handleResume(): void {
    this.state = 'running';
    this.interval();
  }

  handleReset(): void {
    this.state = 'init';
    this.elapsedMs = 0;
    this.hours = false;
    this.stopInterval();
  }

  handleLap(): void {
    if (this.state !== 'running') {
      return;
    }
  }
  interval() {
    this.stopwatchInterval = setInterval(() => {
      this.elapsedMs += 10;
    }, 10);
  }
  stopInterval() {
    clearInterval(this.stopwatchInterval);
  }
  get formattedTime(): string {
    const hours = Math.floor(this.elapsedMs / 3600000);
    const minutes = Math.floor((this.elapsedMs % 3600000) / 60000);
    const seconds = Math.floor((this.elapsedMs % 60000) / 1000);
    const ms = Math.floor((this.elapsedMs % 1000) / 10);

    if (hours > 0) {
      this.hours = true;
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms
        .toString()
        .padStart(2, '0')}`;
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }
}

type StopwatchLap = {
  lap: number;
  overallTime: string;
  lapTime: string;
};
