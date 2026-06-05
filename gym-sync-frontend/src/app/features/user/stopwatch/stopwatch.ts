import { Component } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  imports: [],
  templateUrl: './stopwatch.html',
  styleUrl: './stopwatch.scss',
})
export class Stopwatch {
  // Możliwe stany: 'init', 'running', 'paused'
  state: 'init' | 'running' | 'paused' = 'init';

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
