import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatRadioModule } from "@angular/material/radio";
import { MatNativeDateModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { JobTitle } from "@openapi/model/jobTitle";
import { JobTitleService } from "@openapi/api/jobTitle.service";

@Component({
	selector: 'app-job-title-management-dialog-form',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatButtonModule,
		MatRadioModule,
		MatDialogModule
	],
	templateUrl: './job-title-management-dialog-form.component.html',
	styleUrl: './job-title-management-dialog-form.component.scss'
})
export class JobTitleManagementDialogFormComponent implements OnInit {

	form: FormGroup;

	constructor(
		private readonly jobTitleService: JobTitleService,
		private readonly dialogRef: MatDialogRef<JobTitleManagementDialogFormComponent>,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: JobTitle,
	) {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
		});
	}

	ngOnInit(): void {
		this.form.patchValue(this.data);
	}

	onSubmit(): void {
		this.validateForm()

		if (this.data) {
			this.jobTitleService.addJobTitle(this.form.value).subscribe({
				next: (val: any) => {
					alert('Employee added successfully!');
					this.form.reset();
					this.dialogRef.close(true);
				},
				error: (err: any) => {
					console.error(err);
					alert("Error while adding the employee!");
				},
			});
		}

	}

	validateForm(): void {
		if (this.form.valid) {
			return;
		}
		this.form.markAllAsTouched();
		throw new Error();
	}

}
