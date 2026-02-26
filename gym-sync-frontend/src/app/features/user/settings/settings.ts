import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '../../../shared/services/user.service';
import { EmailConfirmDialog } from './dialog/email-confirm-dialog/email-confirm-dialog';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  login: string = '';
  originalEmail: string = '';
  codeButton: boolean = false;
  durationInSeconds: number = 3000;
  disabledEmail: boolean = false;

  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.emailForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      ]),
    });
    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/),
      ]),
    });
    this.getUser();
  }

  getUser() {
    this.userService.getUser().subscribe({
      next: (response) => {
        this.originalEmail = response.email;
        this.emailForm.patchValue({
          email: response.email,
        });

        this.login = response.login;
        if (response.emailChangeCodeExpires) {
          const expires = new Date(response.emailChangeCodeExpires);
          this.codeButton = expires > new Date();
        } else {
          this.codeButton = false;
        }
      },
      error: (err) => {
        console.log('err:', err);
      },
    });
  }
  updatePassword() {
    console.log(this.passwordForm);
    this.userService
      .updatePassword(
        this.passwordForm.value.password,
        this.passwordForm.value.newPassword,
      )
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log('err:', err);
        },
      });
  }
  updateEmail() {
    this.disabledEmail = true;
    this.userService
      .updateEmail(this.originalEmail, this.emailForm.value.email)
      .subscribe({
        next: () => {
          this.confirmCode();
          this.codeButton = true;
          this.openSnackBar(
            'Kod potwierdzający został wysłany na Twój email.',
            'success',
          );
          this.disabledEmail = false;
        },
        error: () => {
          this.openSnackBar(
            'Nie można zaktualizować emaila. Sprawdź wprowadzone dane.',
            'warning',
          );
          this.disabledEmail = false;
        },
      });
  }
  confirmCode() {
    const dialogRef = this.dialog.open(EmailConfirmDialog, {
      data: {
        title: 'Wprowadź kod potwierdzający',
        subTitle: 'Kod potwierdzający został wysłany na Twój email',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.getUser();
        this.openSnackBar('Adres email został zaktualizowany.', 'success');
      }
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
