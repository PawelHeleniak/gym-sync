import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextTrainingCard } from './next-training-card';

describe('NextTrainingCard', () => {
  let component: NextTrainingCard;
  let fixture: ComponentFixture<NextTrainingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextTrainingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextTrainingCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
