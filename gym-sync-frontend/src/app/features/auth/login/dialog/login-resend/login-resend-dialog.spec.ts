import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginResendDialog } from './login-resend-dialog';

describe('LoginResendDialog', () => {
  let component: LoginResendDialog;
  let fixture: ComponentFixture<LoginResendDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginResendDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginResendDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
