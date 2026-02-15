import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyStatsCard } from './monthly-stats-card';

describe('MonthlyStatsCard', () => {
  let component: MonthlyStatsCard;
  let fixture: ComponentFixture<MonthlyStatsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyStatsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyStatsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
