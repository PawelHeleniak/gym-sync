import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  login: string = '';
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
        this.emailForm.patchValue({
          email: response.email,
        });

        this.login = response.login;
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
}
