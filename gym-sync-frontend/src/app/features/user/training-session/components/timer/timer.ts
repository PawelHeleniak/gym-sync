import { Component, computed, Input, input, OnInit } from '@angular/core';
import { formatTime } from '../../../../../shared/utils/time';
import { TimeItem } from '../../models/training-session.model';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
})
export class Timer implements OnInit {
  @Input() estimatedTime: number = 0;
  @Input() isLastStep: boolean = false;
  list = input<TimeItem[]>([]);

  seconds: number = 0;
  startTimeFromatted: string = '00:00:00';
  endTimeFromatted: string = '00:00:00';
  private intervalId?: number;

  readonly reversedList = computed(() => [...this.list()].reverse());

  ngOnInit() {
    this.intervalId = window.setInterval(() => {
      this.seconds++;
      this.startTimeFromatted = formatTime(this.seconds);
    }, 1000);
    this.endTimeFromatted = formatTime(this.estimatedTime);
  }
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
