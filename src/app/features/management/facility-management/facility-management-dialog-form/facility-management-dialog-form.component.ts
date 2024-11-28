import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatRadioModule } from "@angular/material/radio";
import { Facility } from "@openapi/model/facility";
import { FacilityService } from "@openapi/api/facility.service";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import {
	FacilityManagementDatatableComponent
} from "@app/features/management/facility-management/facility-management-datatable/facility-management-datatable.component";

@Component({
  selector: 'app-facility-management-dialog-form',
  standalone: true,
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
		FacilityManagementDatatableComponent
	],
  templateUrl: './facility-management-dialog-form.component.html',
  styleUrl: './facility-management-dialog-form.component.scss'
})
export class FacilityManagementDialogFormComponent implements OnInit {

	form!: FormGroup;
	isEditing: boolean = false;

	constructor(
		private readonly facilityService: FacilityService,
		private readonly dialogRef: MatDialogRef<FacilityManagementDialogFormComponent>,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Facility,
	) {
		this.buildFormGroup();
	}

	ngOnInit(): void {

		if (this.data) {
			this.isEditing = true;
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

	onRowClick(item: Facility): void {
		this.isEditing = true;
		this.form.patchValue(item);
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
		});
	}

}
