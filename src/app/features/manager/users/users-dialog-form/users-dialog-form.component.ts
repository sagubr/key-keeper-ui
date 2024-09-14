/*Angular Core*/
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

/*Angular Material*/
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/*Angular Material Modules*/
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-users-dialog-form',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    ClipboardModule,
  ],
  templateUrl: './users-dialog-form.component.html',
  styleUrl: './users-dialog-form.component.scss',
})
export class UsersDialogFormComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required]),
    roles: new FormControl('', [Validators.required]),
    active: new FormControl(true),
  });

  hide = true;

  constructor(
    public dialogRef: MatDialogRef<UsersDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
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

export interface DialogData {
  animal: string;
  name: string;
}
