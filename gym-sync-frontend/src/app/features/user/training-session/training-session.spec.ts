import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSession } from './training-session';

describe('TrainingSession', () => {
  let component: TrainingSession;
  let fixture: ComponentFixture<TrainingSession>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingSession]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingSession);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
