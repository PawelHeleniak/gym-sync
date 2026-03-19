import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoginResendDialog } from './dialog/login-resend/login-resend-dialog';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

interface ApiError {
  message?: string;
  isVerified?: boolean;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, MatDialogModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  durationInSeconds: number = 3000;
  disabled: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required]),
    });
  }

  handleLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.disabled = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/panel']);
        this.disabled = false;
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiError;

        this.openSnackBar(
          err.error.message
            ? err.error.message
            : 'Nie udało się zalogować, odśwież stronę i spróbuj ponownie.',
          'warning',
        );

        if (apiError?.isVerified === false) this.resendVerificationDialog();

        this.disabled = false;
      },
    });
  }
  resendVerificationDialog() {
    const dialogRef = this.dialog.open(LoginResendDialog, {
      data: {
        title: 'Czy chcesz ponownie wysłać link weryfikacyjny?',
        subTitle:
          'Nowy link zostanie wysłany na adres e-mail i będzie ważny przez 60 minut. Poprzedni link wygaśnie.',
        login: this.loginForm.get('login')?.value,
      },
    });
    dialogRef
      .afterClosed()
      .subscribe(
        (
          result: { confirmed: boolean; confirmedMessage: string } | undefined,
        ) => {
          if (!result) return;

          if (result.confirmed)
            this.openSnackBar(result.confirmedMessage, 'success');
        },
      );
  }
  openSnackBar(message: string, mode: string) {
    if (mode === 'success') {
      this._snackBar.open(message, '', {
        duration: this.durationInSeconds,
        panelClass: ['snackbar', 'snackbar--success'],
      });
    } else if (mode === 'warning') {
      this._snackBar.open(message, '', {
        duration: this.durationInSeconds,
        panelClass: ['snackbar', 'snackbar--warning'],
      });
    }
  }
}
