import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { UsersService } from "@openapi/api/users.service";
import { UserDto } from "@openapi/model/userDto";
import { AssignmentService } from "@openapi/api/assignment.service";
import { Assignment } from "@openapi/model/assignment";
import { compareById } from "@app/core/utils/utils";
import { DialogWrappedInfo, DialogWrappedService } from "@app/shared/components/dialog-wrapped/dialog-wrapped.service";

@Component({
	selector: 'app-user-form-dialog',
	imports: [
		CommonModule,
		MatSelectModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		ReactiveFormsModule,
		ClipboardModule,
		MatDialogModule,
	],
	templateUrl: './user-form-dialog.component.html',
	styleUrl: './user-form-dialog.component.scss'
})
export class UserFormDialogComponent implements OnInit {

	form!: FormGroup;
	assignment: Assignment[] = [];

	protected readonly compareById = compareById;

	constructor(
		private readonly dialogRef: MatDialogRef<UserFormDialogComponent>,
		private readonly dialogWrapped: DialogWrappedService,
		private readonly userService: UsersService,
		private readonly assignmentService: AssignmentService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: UserDto,
	) {
		this.buildFormGroup();
		this.findAllAssignment();
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
			this.userService.createUser(this.form.value).subscribe({
				next: (res) => {
					this.form.reset();
					this.dialogRef.close(true);
					this.dialogWrapped.openFeedback(
						{
							title: 'Novo usuário registrado na aplicação',
							message: `O usuário já está ativo na aplicação. A senha para o primeiro acesso será enviada no e-mail ${ res.email } `,
							icon: "success"
						} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
				},
				error: (err: any) => {
					console.error(err);
					this.dialogWrapped.openFeedback(
						{
							title: 'Não foi possível concluir o registro',
							message: `Tente novamente mais tarde.`,
							icon: "warning"
						} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
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
			assignment: [''],
		});
	}

	private findAllAssignment(): void {
		this.assignmentService.findAllAssignment().subscribe({
			next: (res) => {
				this.assignment = res;
			},
			error: (err) => {
				console.error('Error:', err);
			}
		});
	}

}

