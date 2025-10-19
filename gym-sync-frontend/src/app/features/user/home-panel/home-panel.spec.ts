import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePanel } from './home-panel';

describe('HomePanel', () => {
  let component: HomePanel;
  let fixture: ComponentFixture<HomePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
