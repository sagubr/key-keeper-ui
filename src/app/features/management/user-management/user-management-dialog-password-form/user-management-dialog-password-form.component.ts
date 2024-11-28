/* Angular Core */
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

/* Angular Material */
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/*Angular Material Modules */
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { UserDto } from "@openapi/model/userDto";

@Component({
  selector: 'app-user-management-dialog-password-form',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-management-dialog-password-form.component.html',
  styleUrl: './user-management-dialog-password-form.component.scss',
})
export class UserManagementDialogPasswordFormComponent {
  form = new FormGroup({
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required]),
  });

  hide = true;

  constructor(
    public dialogRef: MatDialogRef<UserManagementDialogPasswordFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDto
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  getErrorMessage() {
    if (this.form.get('email')?.hasError('required')) {
      return 'Você deve inserir um valor';
    }
    return this.form.get('email')?.hasError('email')
      ? 'Não é um e-mail válido'
      : '';
  }

  checkPasswords() {
    const password = this.form.get('password')?.value;
    const repeatPassword = this.form.get('repeatPassword')?.value;
    return !(password === repeatPassword);
  }
}
