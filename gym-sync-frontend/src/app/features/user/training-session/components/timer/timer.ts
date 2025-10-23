import { Component, computed, Input, input } from '@angular/core';
import { formatTime } from '../../../../../shared/utils/time';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
})
export class Timer {
  seconds = 0;
  private intervalId?: number;
  @Input() estimatedTime: number = 0;
  list = input<any[]>([]);
  readonly reversedList = computed(() => {
    return [...this.list()].reverse();
  });
  startTimeFromatted: string = '00:00:00';
  endTimeFromatted: string = '00:00:00';
  ngOnInit() {
    this.intervalId = window.setInterval(() => {
      this.seconds++;
      this.startTimeFromatted = formatTime(this.seconds);
    }, 1000);
    this.endTimeFromatted = formatTime(this.estimatedTime);
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
