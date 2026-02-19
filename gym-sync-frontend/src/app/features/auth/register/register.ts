import { Component, inject } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  @Output() view = new EventEmitter<'login'>();

  handleLogin() {
    this.view.emit('login');
  }

  constructor(private authService: AuthService) {}

  registerForm!: FormGroup;
  private _snackBar = inject(MatSnackBar);
  durationInSeconds: number = 3000;
  disabled: boolean = false;

  ngOnInit(): void {
    this.registerForm = new FormGroup(
      {
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        ]),
        login: new FormControl('', Validators.required),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/),
        ]),
        repeatPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;

    if (!password || !repeatPassword) {
      return null;
    }

    return password === repeatPassword ? null : { passwordsMismatch: true };
  }

  handleRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.disabled = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.openSnackBar('Użytkownik został utworzony.', 'success');
        this.handleLogin();
        this.disabled = false;
      },
      error: (err) => {
        this.openSnackBar(
          err.error.message
            ? err.error.message
            : 'Nie udało się zarejestrować użytkownika, odśwież stronę i spróbuj ponownie.',
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
