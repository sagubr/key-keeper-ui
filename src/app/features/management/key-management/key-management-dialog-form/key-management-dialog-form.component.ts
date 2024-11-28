import { Component, Inject, OnInit } from '@angular/core';
import {
    FacilityManagementDatatableComponent
} from "@app/features/management/facility-management/facility-management-datatable/facility-management-datatable.component";
import { MatButton, MatButtonModule } from "@angular/material/button";
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogContent, MatDialogModule,
	MatDialogRef,
	MatDialogTitle
} from "@angular/material/dialog";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInput, MatInputModule } from "@angular/material/input";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FacilityService } from "@openapi/api/facility.service";
import { Facility } from "@openapi/model/facility";
import { Key } from "@openapi/model/key";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import {
	KeyManagementDatatableComponent
} from "@app/features/management/key-management/key-management-datatable/key-management-datatable.component";

@Component({
  selector: 'app-key-management-dialog-form',
  standalone: true,
	imports: [
		FacilityManagementDatatableComponent,
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
		KeyManagementDatatableComponent,
	],
  templateUrl: './key-management-dialog-form.component.html',
  styleUrl: './key-management-dialog-form.component.scss'
})
export class KeyManagementDialogFormComponent implements OnInit {

	form!: FormGroup;
	isEditing: boolean = false;

	constructor(
		private readonly facilityService: FacilityService,
		private readonly dialogRef: MatDialogRef<KeyManagementDialogFormComponent>,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Key,
	) {
		this.buildFormGroup();
	}

	ngOnInit(): void {
		if (this.data) {
			this.form.patchValue(this.data);
		}
	}

	onSubmit(): void {
		this.validateForm()

		if (this.data) {
			this.facilityService.addFacility(this.form.value).subscribe({
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
			location: ['', Validators.required],
			description: ['', Validators.required],
		});
	}

}
