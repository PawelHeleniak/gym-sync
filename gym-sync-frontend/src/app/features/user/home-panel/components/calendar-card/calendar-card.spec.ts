import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCard } from './calendar-card';

describe('CalendarCard', () => {
  let component: CalendarCard;
  let fixture: ComponentFixture<CalendarCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
