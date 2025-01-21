import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Location } from "@openapi/model/location";
import {
	FacilityManagementDialogFormComponent
} from "@app/features/resource-management/facility-management/facility-management-dialog-form/facility-management-dialog-form.component";
import { compareById } from "@app/core/utils/utils";
import { JobTitle } from "@openapi/model/jobTitle";
import { JobTitleService } from "@openapi/api/jobTitle.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { MatRadioModule } from "@angular/material/radio";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { RequesterService } from "@openapi/api/requester.service";

@Component({
    selector: 'app-requester-management-dialog-form',
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
    ],
    templateUrl: './requester-management-dialog-form.component.html',
    styleUrl: './requester-management-dialog-form.component.scss'
})
export class RequesterManagementDialogFormComponent implements OnInit{

	compareById: (o1: any, o2: any) => boolean = compareById;

	form!: FormGroup;
	jobTitles: JobTitle[] = [];

	constructor(
		public dialogRef: MatDialogRef<RequesterManagementDialogFormComponent>,
		private readonly dialog: MatDialog,
		private readonly requesterService: RequesterService,
		private readonly jobTitleService: JobTitleService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Location,
	) {
		this.buildFormGroup();
		this.findAllJobTitles();
	}

	ngOnInit(): void {
		this.form.patchValue(this.data);
	}

	onSubmit(): void {
		this.validateForm()

		if (this.data) {
			this.requesterService.addRequester(this.form.value).subscribe({
				next: () => {
					this.form.reset();
					this.dialogRef.close(true);
				}
			});
		}
	}

	openDialogFacility(): void {
		const dialogRef = this.dialog.open(FacilityManagementDialogFormComponent, {
			data: {},
		});
	}

	private findAllJobTitles(): void {
		this.jobTitleService.findAllJobTitle().subscribe({
				next: (res: JobTitle[]) => {
					this.jobTitles = res;
				}
			}
		)
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
			email: [''],
			register: ['', Validators.required],
			jobTitle: ['', Validators.required]
		});
	}
}
