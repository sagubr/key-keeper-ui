import { Component, Inject, OnInit } from '@angular/core';
import { MatButton, MatButtonModule } from "@angular/material/button";
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogContent, MatDialogModule,
	MatDialogRef,
	MatDialogTitle
} from "@angular/material/dialog";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput, MatInputModule } from "@angular/material/input";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { UsersService } from "@openapi/api/users.service";
import { UserDto } from "@openapi/model/userDto";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatChipsModule } from "@angular/material/chips";

@Component({
  selector: 'app-location-type-form-dialog',
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
		MatChipsModule,
	],
  templateUrl: './location-type-form-dialog.html',
  styleUrl: './location-type-form-dialog.scss'
})
export class LocationTypeFormDialog implements OnInit {

	form!: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<LocationTypeFormDialog>,
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

	onCancel(): void {
		this.dialogRef.close();
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
			description: ['']
		});
	}

}
