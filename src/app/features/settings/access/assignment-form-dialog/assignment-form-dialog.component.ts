import { Component, Inject, OnInit } from '@angular/core';
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators
} from "@angular/forms";
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle
} from "@angular/material/dialog";
import { UsersService } from "@openapi/api/users.service";
import { UserDto } from "@openapi/model/userDto";
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { NgIf } from "@angular/common";

@Component({
	selector: 'app-assignment-form-dialog',
	imports: [CdkDropList, CdkDrag, FormsModule, MatButton, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatIcon, MatIconButton, ReactiveFormsModule, MatError, MatFormField, MatInput, MatLabel, NgIf],
	templateUrl: './assignment-form-dialog.component.html',
	styleUrl: './assignment-form-dialog.component.scss'
})
export class AssignmentFormDialogComponent implements OnInit {

	formGroup!: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<AssignmentFormDialogComponent>,
		private readonly userService: UsersService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: UserDto,
	) {
		this.buildFormGroup();
	}

	ngOnInit(): void {
		this.formGroup.patchValue(this.data);
	}

	todo: string[] = [
		'Emprestimos',
		'Histórico de Empréstimos',
		'Agendamentos',
		'[Autorizações] Solicitantes'];

	done: string [] = [];

	drop(event: CdkDragDrop<string[]>): void {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);
		}

		this.updateRoles();
	}

	private updateRoles(): void {
		this.roles.clear();
		this.done.forEach((role) => this.roles.push(new FormControl(role)));
	}

	getErrorMessage() {
		if (this.formGroup.get('email')?.hasError('required')) {
			return 'Você deve inserir um valor';
		}
		return this.formGroup.get('email')?.hasError('email')
			? 'Não é um e-mail válido'
			: '';
	}

	alertFormValues(formGroup: FormGroup) {
		alert(JSON.stringify(formGroup.value, null, 2));
	}

	onCancel(): void {
		this.dialogRef.close(); // Fecha o diálogo quando o botão Cancelar é clicado
	}

	private validateForm(): void {
		if (this.formGroup.valid) {
			return;
		}
		this.formGroup.markAllAsTouched();
		throw new Error();
	}

	private buildFormGroup(): void {
		this.formGroup = this.formBuilder.group({
			name: ['', Validators.required],
			roles: this.formBuilder.array([], Validators.required),
		});
	}

	get roles(): FormArray {
		return this.formGroup.get('roles') as FormArray;
	}


}
