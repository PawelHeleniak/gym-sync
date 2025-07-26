import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingPlanBuilder } from './training-plan-builder';

describe('TrainingPlanBuilder', () => {
  let component: TrainingPlanBuilder;
  let fixture: ComponentFixture<TrainingPlanBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingPlanBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingPlanBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
