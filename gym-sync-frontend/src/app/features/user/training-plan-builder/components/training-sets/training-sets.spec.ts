import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSets } from './training-sets';

describe('TrainingSets', () => {
  let component: TrainingSets;
  let fixture: ComponentFixture<TrainingSets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingSets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingSets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
