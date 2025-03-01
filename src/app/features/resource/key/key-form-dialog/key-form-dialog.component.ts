import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Key } from "@openapi/model/key";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { KeyService } from "@openapi/api/key.service";
import { MatSelectModule } from "@angular/material/select";
import { NgIf } from "@angular/common";
import { compareById } from "@app/core/utils/utils";
import { DialogWrappedInfo, DialogWrappedService } from "@app/shared/components/dialog-wrapped/dialog-wrapped.service";

export enum TypeOfImportance {
	PRINCIPAL = 'PRINCIPAL',
	SECUNDARIA = 'SECUNDARIA'
}

@Component({
	selector: 'app-key-form-dialog',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatButtonModule,
		MatRadioModule,
		MatDialogModule,
		MatIconModule,
		MatMenuModule,
		MatProgressBarModule,
		MatOptionModule,
		MatSelectModule,
		NgIf,
	],
	templateUrl: './key-form-dialog.component.html',
	styleUrl: './key-form-dialog.component.scss'
})
export class KeyFormDialogComponent implements OnInit {

	formGroup!: FormGroup;
	timestampCode: number = 0;

	protected readonly TypeOfImportance = TypeOfImportance;

	constructor(
		private readonly keyService: KeyService,
		private readonly dialogWrapped: DialogWrappedService,
		private readonly dialogRef: MatDialogRef<KeyFormDialogComponent>,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Key,
	) {
		this.timestampCode = Date.now();
		this.buildFormGroup();
	}

	ngOnInit(): void {
		if (this.data) {
			this.formGroup.patchValue(this.data);
		}
	}

	onSubmit(): void {
		this.validateForm()
		this.formGroup.get('code')?.enable()
		if (this.data) {
			this.keyService.addKey(this.formGroup.value).subscribe({
				next: () => {
					this.formGroup.reset();
					this.dialogRef.close(true);
					this.dialogWrapped.openFeedback(
						{
							title: 'Salvo com sucesso',
							message: ``,
							icon: "success"
						} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
				},
				error: (err: any) => {
					console.error(err);
					this.dialogWrapped.openFeedback(
						{
							title: 'Não foi possível concluir o registro',
							message: ``,
							icon: "warning"
						} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
				},
			});
		}
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
			code: [{ value: this.timestampCode, disabled: true, }, Validators.required],
			keyType: ['', Validators.required],
			description: ['', Validators.required],
			location: [this.data.location]
		});
	}

	protected readonly compareById = compareById;
	protected readonly Date = Date;
}
