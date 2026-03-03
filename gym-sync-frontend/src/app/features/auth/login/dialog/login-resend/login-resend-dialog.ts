import { Component, inject, model } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

type DialogData = {
  title: string;
  subTitle: string;
  login: string;
};

@Component({
  selector: 'app-login-resend',
  imports: [],
  templateUrl: './login-resend-dialog.html',
  styleUrl: './login-resend-dialog.scss',
})
export class LoginResendDialog {
  disabled: boolean = false;
  error: boolean = false;
  errorInfo: string = '';

  readonly dialogRef = inject(MatDialogRef<LoginResendDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly title = model(this.data.title);
  readonly subTitle = model(this.data.subTitle);
  readonly login = model(this.data.login);

  constructor(private authService: AuthService) {}

  resendVerificationEmail(): void {
    this.disabled = true;
    this.authService.resendVerificationEmail(this.login()).subscribe({
      next: (response: { message: string }) => {
        this.dialogRef.close({
          confirmed: true,
          confirmedMessage: response.message,
        });
        this.disabled = false;
      },
      error: (err) => {
        this.errorInfo =
          err.error.message ??
          'Nie udało się wysłać linku werryfikacyjnego ponownie, odśwież stronę i spróbuj ponownie.';

        this.error = true;
        this.disabled = false;
      },
    });
  }
}
