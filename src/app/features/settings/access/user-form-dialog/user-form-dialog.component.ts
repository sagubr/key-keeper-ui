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
import { DialogWrappedComponent } from "@app/shared/components/dialog-wrapped/dialog-wrapped.component";

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

	constructor(
		private readonly dialogRef: MatDialogRef<UserFormDialogComponent>,
		private readonly dialog: MatDialog,
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
				next: () => {
					this.form.reset();
					this.dialogRef.close(true);
					this.openDialogFeedback(true);
				},
				error: (err: any) => {
					console.error(err);
					this.openDialogFeedback(false);
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
			assignment: ['', Validators.required],
			active: [],
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

	private openDialogFeedback(arg: boolean): void {
		if (arg) {
			this.dialog.open(DialogWrappedComponent, {
				data: {
					title: 'Atribuição salva com sucesso',
					message: `Este registro já pode ser atribuído para usuários da aplicação.`,
					icon: 'success',
					color: 'primary',
					confirmText: 'Confirmar',
					hideCancel: false,
				},
				width: '400px'
			});
		} else {
			this.dialog.open(DialogWrappedComponent, {
				data: {
					title: 'Não foi possível concluir o registro',
					message: `Tente novamente mais tarde.`,
					icon: 'danger',
					color: 'primary',
					confirmText: 'Confirmar',
					hideCancel: false,
				},
				width: '400px'
			});
		}
	}

	protected readonly compareById = compareById;
}

