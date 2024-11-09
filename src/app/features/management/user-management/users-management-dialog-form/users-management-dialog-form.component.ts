/*Angular Core*/
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
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

/*Custom Components*/
import { UsersService } from "@openapi/api/users.service";
import { UserDto } from "@openapi/model/userDto";
import { Roles } from "@openapi/model/roles";

@Component({
	selector: 'app-users-management-dialog-form',
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
	templateUrl: './users-management-dialog-form.component.html',
	styleUrl: './users-management-dialog-form.component.scss',
})
export class UsersManagementDialogFormComponent {

	form = new FormGroup({
		name: new FormControl('', [Validators.required]),
		username: new FormControl('', [Validators.required]),
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required]),
		repeatPassword: new FormControl('', [Validators.required]),
		roles: new FormControl('', [Validators.required]),
		active: new FormControl(true),
	});

	protected readonly Roles = Roles;

	hide = true;

	constructor(
		public dialogRef: MatDialogRef<UsersManagementDialogFormComponent>,
		private readonly _userService: UsersService,
		@Inject(MAT_DIALOG_DATA) public data: UserDto
	) {
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	onClick(): void {
		const user: UserDto = {
			email: this.form.get('email')?.value!,
			name: this.form.get('name')?.value!,
			password: this.form.get('password')?.value!,
			username: this.form.get('username')?.value!,
			roles: this.form.get('roles')?.value! as Roles
		}
		this._save(user)
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

	private _save(user: UserDto) {
		this._userService.addUser(user).subscribe({
			next: (response) => {
				this.dialogRef.close(response);
			},
			error: (err) => {
				console.error('Error saving user:', err);
			}
		});
	}
}

