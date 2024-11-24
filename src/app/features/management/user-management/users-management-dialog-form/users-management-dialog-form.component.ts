/*Angular Core*/
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { CommonModule } from '@angular/common';

/*Angular Material*/
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

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
		MatDialogModule,
	],
	templateUrl: './users-management-dialog-form.component.html',
	styleUrl: './users-management-dialog-form.component.scss',
})
export class UsersManagementDialogFormComponent implements OnInit {

	protected readonly Roles = Roles;

	hide = true;

	form!: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<UsersManagementDialogFormComponent>,
		private readonly userService: UsersService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: UserDto,
	) {
		this.buildFormGroup();
	}

	ngOnInit(): void {
		this.form.patchValue(this.data);
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

	onSubmit(): void {
		this.validateForm()

		if (this.data) {
			this.userService.addUser(this.form.value).subscribe({
				next: () => {
					this.form.reset();
					this.dialogRef.close(true);
				},
				error: (err: any) => {
					console.error(err);
				},
			});
		}
	}

	private validateForm(): void {
		if (this.form.valid) {
			return;
		}
		this.form.markAllAsTouched();
		throw new Error();
	}

	private buildFormGroup(): void {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			username: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
			repeatPassword: ['', Validators.required],
			roles: ['', Validators.required],
			active: [],
		});
	}

}

