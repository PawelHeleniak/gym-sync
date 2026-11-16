import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TimeItem } from '../../models/training-session.model';
import { Timer } from './components/timer/timer';
import { Steps } from './components/steps/steps';

@Component({
  selector: 'app-training-session-page',
  imports: [Timer, Steps],
  templateUrl: './training-session-page.html',
  styleUrl: './training-session-page.scss',
})
export class TrainingSessionPage {
  estimatedTime: number | null = null;
  elapsedSeconds = 0;
  doneExercises: TimeItem[] = [];
  isLastStep = false;

  @ViewChild(Timer) timer?: Timer;
  private router = inject(Router);

  backToList(): void {
    this.router.navigate(['/trening']);
  }
}
