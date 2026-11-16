import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSessionPage } from './training-session-page';

describe('TrainingSessionPage', () => {
  let component: TrainingSessionPage;
  let fixture: ComponentFixture<TrainingSessionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingSessionPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingSessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
