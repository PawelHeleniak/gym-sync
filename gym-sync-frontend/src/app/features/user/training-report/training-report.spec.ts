import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingReport } from './training-report';

describe('TrainingReport', () => {
  let component: TrainingReport;
  let fixture: ComponentFixture<TrainingReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
