import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { StopwatchLaps } from './components/stopwatch-laps/stopwatch-laps';

@Component({
  selector: 'app-stopwatch',
  imports: [StopwatchLaps],
  templateUrl: './stopwatch.html',
  styleUrl: './stopwatch.scss',
})
export class Stopwatch implements OnInit, OnDestroy {
  state: 'init' | 'running' | 'paused' = 'init';
  laps: StopwatchLap[] = [];
  elapsedMs: number = 0;

  stopwatchInterval?: ReturnType<typeof setInterval>;

  private storageKey: string = '';
  private startedAt: number | null = null;
  private elapsedBeforeStart: number = 0;
  private lapTimes: number[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserState();
  }

  ngOnDestroy(): void {
    this.saveState();
    this.stopInterval();
  }

  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent): void {
    if (event.key !== 'token' && event.key !== null) return;
    this.saveState();
    this.stopInterval();
    this.loadUserState();
  }

  handleStart(): void {
    if (this.state !== 'init') return;
    this.start();
  }

  handlePause(): void {
    if (this.state !== 'running') return;
    this.updateElapsedTime();
    this.state = 'paused';
    this.startedAt = null;
    this.stopInterval();
    this.saveState();
  }

  handleResume(): void {
    if (this.state !== 'paused') return;
    this.start();
  }

  handleReset(): void {
    this.stopInterval();
    this.state = 'init';
    this.elapsedMs = 0;
    this.elapsedBeforeStart = 0;
    this.startedAt = null;
    this.laps = [];
    this.lapTimes = [];
    this.saveState();
  }

  handleLap(): void {
    if (this.state !== 'running') return;
    this.updateElapsedTime();
    this.addLap(this.elapsedMs);
    this.saveState();
  }

  interval(): void {
    this.stopInterval();
    this.stopwatchInterval = setInterval(() => {
      this.updateElapsedTime();
    }, 10);
  }

  stopInterval(): void {
    clearInterval(this.stopwatchInterval);
    this.stopwatchInterval = undefined;
  }

  get hours(): boolean {
    return this.elapsedMs >= 3600000;
  }

  get formattedTime(): string {
    return this.formatTime(this.elapsedMs);
  }

  get formattedLapTime(): string {
    const previousLapTime = this.lapTimes.at(-1) ?? 0;
    return this.formatTime(this.elapsedMs - previousLapTime);
  }

  private start(): void {
    this.elapsedBeforeStart = this.elapsedMs;
    this.startedAt = Date.now();
    this.state = 'running';
    this.interval();
    this.saveState();
  }

  private updateElapsedTime(): void {
    if (this.state !== 'running' || this.startedAt === null) return;
    this.elapsedMs =
      this.elapsedBeforeStart + Math.max(0, Date.now() - this.startedAt);
  }

  private addLap(elapsedMs: number): void {
    const previousLapTime = this.lapTimes.at(-1) ?? 0;
    this.laps = [
      ...this.laps,
      {
        lap: this.laps.length + 1,
        overallTime: this.formatTime(elapsedMs),
        lapTime: this.formatTime(elapsedMs - previousLapTime),
      },
    ];
    this.lapTimes.push(elapsedMs);
  }

  private saveState(): void {
    if (!this.storageKey) return;

    try {
      sessionStorage.setItem(
        this.storageKey,
        JSON.stringify({
          state: this.state,
          elapsedMs:
            this.state === 'running' ? this.elapsedBeforeStart : this.elapsedMs,
          startedAt: this.startedAt,
          lapTimes: this.lapTimes,
        }),
      );
    } catch {
      console.warn('Nie udało się zapisać stanu stoppera');
    }
  }

  private loadUserState(): void {
    const userId = this.authService.getUserId();
    this.storageKey = userId ? `stopwatch:${userId}` : '';
    this.state = 'init';
    this.elapsedMs = 0;
    this.elapsedBeforeStart = 0;
    this.startedAt = null;
    this.laps = [];
    this.lapTimes = [];
    if (!this.storageKey) return;

    try {
      const storage = sessionStorage.getItem(this.storageKey);
      if (!storage) return;
      const saved: unknown = JSON.parse(storage);
      if (!this.isSavedState(saved)) return;

      this.state = saved.state;
      this.elapsedMs = saved.elapsedMs;
      this.elapsedBeforeStart = saved.elapsedMs;
      this.startedAt = saved.startedAt;
      saved.lapTimes.forEach((elapsedMs) => this.addLap(elapsedMs));
      this.updateElapsedTime();
      if (this.state === 'running') this.interval();
    } catch {
      console.warn('Nie udało się wczytać stanu stoppera');
    }
  }

  private isSavedState(saved: unknown): saved is StopwatchState {
    if (!saved || typeof saved !== 'object') return false;
    const data = saved as StopwatchState;
    if (!['init', 'running', 'paused'].includes(data.state)) return false;
    if (!Number.isFinite(data.elapsedMs) || data.elapsedMs < 0) return false;
    if (data.state === 'running') {
      if (
        typeof data.startedAt !== 'number' ||
        !Number.isFinite(data.startedAt) ||
        data.startedAt < 0
      )
        return false;
    } else if (data.startedAt !== null) return false;

    const totalTime =
      data.elapsedMs +
      (data.startedAt === null ? 0 : Math.max(0, Date.now() - data.startedAt));
    return (
      Array.isArray(data.lapTimes) &&
      data.lapTimes.every(
        (time, index) =>
          Number.isFinite(time) &&
          time >= 0 &&
          time <= totalTime &&
          (index === 0 || time >= data.lapTimes[index - 1]),
      ) &&
      (data.state !== 'init' ||
        (data.elapsedMs === 0 && data.lapTimes.length === 0))
    );
  }

  private formatTime(elapsedMs: number): string {
    const hours = Math.floor(elapsedMs / 3600000);
    const minutes = Math.floor((elapsedMs % 3600000) / 60000);
    const seconds = Math.floor((elapsedMs % 60000) / 1000);
    const ms = Math.floor((elapsedMs % 1000) / 10);
    const time = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;

    return hours > 0 ? `${hours.toString().padStart(2, '0')}:${time}` : time;
  }
}

type StopwatchLap = {
  lap: number;
  overallTime: string;
  lapTime: string;
};

type StopwatchState = {
  state: 'init' | 'running' | 'paused';
  elapsedMs: number;
  startedAt: number | null;
  lapTimes: number[];
};
