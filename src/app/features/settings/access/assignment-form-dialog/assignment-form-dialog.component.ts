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
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { AssignmentService } from "@openapi/api/assignment.service";
import { Assignment } from "@openapi/model/assignment";
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Permissions } from "@openapi/model/permissions";
import { ACTIONS_MAP } from "@app/core/services/actions.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DialogWrappedInfo, DialogWrappedService } from "@app/shared/components/dialog-wrapped/dialog-wrapped.service";

@Component({
	selector: 'app-assignment-form-dialog',
	imports: [
		CdkDropList,
		CdkDrag,
		FormsModule,
		MatButtonModule,
		MatDialogModule,
		MatIconModule,
		MatIconButton,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatTooltipModule
	],
	templateUrl: './assignment-form-dialog.component.html',
	styleUrls: ['./assignment-form-dialog.component.scss']
})
export class AssignmentFormDialogComponent implements OnInit {

	formGroup!: FormGroup;
	notGranted: { permission: Permissions, description: string, route: string, warning?: string }[] = ACTIONS_MAP;
	granted: { permission: Permissions, description: string, route: string, warning?: string }[] = [];

	constructor(
		private readonly dialogRef: MatDialogRef<AssignmentFormDialogComponent>,
		private readonly dialogWrapped: DialogWrappedService,
		private readonly service: AssignmentService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Assignment,
	) {
		this.notGranted = ACTIONS_MAP
		this.buildFormGroup();
	}

	ngOnInit(): void {
		this.granted = [];
		this.notGranted = [...ACTIONS_MAP];
		this.formGroup.patchValue(this.data);

		if (this.data.permissions && this.data.permissions.length > 0) {
			this.granted = ACTIONS_MAP.filter(action =>
				this.data.permissions?.includes(action.permission)
			);

			this.notGranted = this.notGranted.filter(action =>
				!this.granted.some(grantedAction => grantedAction.permission === action.permission)
			);
		}
	}

	onSubmit(): void {
		this.validateForm();
		if (this.data && this.data.id) {
			this.edit();
		} else {
			this.create();
		}
	}

	get permissions(): FormArray {
		return this.formGroup.get('permissions') as FormArray;
	}

	drop(event: CdkDragDrop<{
		permission: Permissions,
		description: string,
		route: string,
		warning?: string
	}[]>): void {
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
		this.updatePermissions();
	}

	private updatePermissions(): void {
		this.permissions.clear();
		this.granted.forEach(action => {
			this.permissions.push(new FormControl(action.permission));
		});
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
			permissions: this.formBuilder.array([], Validators.required),
		});
	}

	private create(): void {
		this.service.createAssignment(this.formGroup.value).subscribe(
			{
				next: () => {
					this.formGroup.reset();
					this.dialogRef.close(true);
					this.dialogWrapped.openFeedback(
						{
							title: 'Atribuição atualizada com sucesso',
							message: 'Este registro já pode ser atribuído para usuários da aplicação.',
							icon: 'success',
						} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
				},
				error: () => {
					this.dialogWrapped.openFeedback(
						{
							title: 'Não foi possível concluir o registro',
							message: 'Tente novamente mais tarde.',
							icon: 'danger',
						} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
				}
			}
		);
	}

	private edit(): void {
		const command = {
			...this.formGroup.value,
			assignmentId: this.data.id
		}
		this.service.updateAssignment(command).subscribe(
			{
				next: () => {
					this.formGroup.reset();
					this.dialogRef.close(true);
					this.dialogWrapped.openFeedback(
						{
							title: 'Atribuição atualizada com sucesso',
							message: 'Este registro já pode ser atribuído para usuários da aplicação.',
							icon: 'success',
						} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
				},
				error: () => {
					this.dialogWrapped.openFeedback(
						{
							title: 'Não foi possível concluir o registro',
							message: 'Tente novamente mais tarde.',
							icon: 'danger',
						} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
				}
			}
		);
	}

}
