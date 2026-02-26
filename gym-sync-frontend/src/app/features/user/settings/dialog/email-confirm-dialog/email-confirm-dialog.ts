import { Component, inject, model } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UserService } from '../../../../../shared/services/user.service';

type DialogData = {
  title: string;
  subTitle: string;
};

@Component({
  selector: 'app-email-confirm-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './email-confirm-dialog.html',
  styleUrl: './email-confirm-dialog.scss',
})
export class EmailConfirmDialog {
  codeForm!: FormGroup;
  disabled: boolean = false;
  error: boolean = false;
  errorInfo: string = '';

  readonly dialogRef = inject(MatDialogRef<EmailConfirmDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly title = model(this.data.title);
  readonly subTitle = model(this.data.subTitle);

  constructor(private userService: UserService) {
    this.codeForm = new FormGroup({
      code: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
      ]),
    });
  }
  confirmCode(): void {
    this.disabled = true;
    this.userService.confirmEmail(this.codeForm.get('code')?.value).subscribe({
      next: () => {
        this.dialogRef.close({
          confirmed: true,
        });
        this.disabled = false;
      },
      error: (err) => {
        if (err.error.message) this.errorInfo = err.error.message;
        else
          this.errorInfo =
            'Błąd podczas potwierdzania kodu. Sprawdź wprowadzone dane.';

        this.error = true;
        this.disabled = false;
      },
    });
  }
}
