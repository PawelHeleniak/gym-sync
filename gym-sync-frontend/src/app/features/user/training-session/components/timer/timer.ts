import { Component } from '@angular/core';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
})
export class Timer {
  seconds = 0;
  private intervalId?: number;

  ngOnInit() {
    this.intervalId = window.setInterval(() => {
      this.seconds++;
    }, 1000);
  }
  get formattedTime(): string {
    const minutes = Math.floor(this.seconds / 60);
    const secs = this.seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
