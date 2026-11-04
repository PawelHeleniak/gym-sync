import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastTrainingCard } from './last-training-card';

describe('LastTrainingCard', () => {
  let component: LastTrainingCard;
  let fixture: ComponentFixture<LastTrainingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastTrainingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastTrainingCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
