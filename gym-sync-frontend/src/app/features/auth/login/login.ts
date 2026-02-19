import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  private _snackBar = inject(MatSnackBar);
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
        localStorage.setItem('user', response.user.id);
        this.router.navigate(['/panel']);
        this.disabled = false;
      },
      error: (err) => {
        this.openSnackBar(
          err.error.message
            ? err.error.message
            : 'Nie udało się zalogować, odśwież stronę i spróbuj ponownie.',
          'warning',
        );
        this.disabled = false;
      },
    });
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
