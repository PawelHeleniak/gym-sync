import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfirmDialog } from './email-confirm-dialog';

describe('EmailConfirmDialog', () => {
  let component: EmailConfirmDialog;
  let fixture: ComponentFixture<EmailConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailConfirmDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
