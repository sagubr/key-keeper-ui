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
	MatDialog,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogTitle
} from "@angular/material/dialog";
import { UserDto } from "@openapi/model/userDto";
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { NgIf } from "@angular/common";
import { Screen } from "@openapi/model/screen";
import { Assignment } from "@openapi/model/assignment";
import { AssignmentService } from "@openapi/api/assignment.service";
import { DialogWrappedComponent } from "@app/shared/components/dialog-wrapped/dialog-wrapped.component";

@Component({
	selector: 'app-assignment-form-dialog',
	imports: [CdkDropList, CdkDrag, FormsModule, MatButton, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatIcon, MatIconButton, ReactiveFormsModule, MatError, MatFormField, MatInput, MatLabel, NgIf],
	templateUrl: './assignment-form-dialog.component.html',
	styleUrl: './assignment-form-dialog.component.scss'
})
export class AssignmentFormDialogComponent implements OnInit {

	formGroup!: FormGroup;
	notGranted: Screen[] = Object.values(Screen);
	granted: Screen[] = [];

	constructor(
		private readonly dialog: MatDialog,
		private readonly service: AssignmentService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: UserDto,
	) {
		this.buildFormGroup();
	}

	ngOnInit(): void {
		this.formGroup.patchValue(this.data);
	}

	onSubmit(): void {
		this.validateForm();
		if (this.data) {
			this.create();
		}
	}

	get screens(): FormArray {
		return this.formGroup.get('screens') as FormArray;
	}

	drop(event: CdkDragDrop<Screen[]>): void {
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
		this.updateScreens();
	}

	private updateScreens(): void {
		this.screens.clear();
		this.granted.forEach((role) => this.screens.push(new FormControl(role)));
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
			screens: this.formBuilder.array([], Validators.required),
		});
	}

	private create(): void {
		this.service.createAssignment(this.formGroup.value).subscribe(
			{
				next: (res: Assignment) => {
					console.log(res);
					this.dialog.closeAll();
					this.openDialogFeedback(true);
				},
				error: (error) => {
					console.error(error)
					this.openDialogFeedback(true);
				}
			}
		)
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

}
