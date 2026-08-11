import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopwatchLaps } from './stopwatch-laps';

describe('StopwatchLaps', () => {
  let component: StopwatchLaps;
  let fixture: ComponentFixture<StopwatchLaps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StopwatchLaps]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopwatchLaps);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
