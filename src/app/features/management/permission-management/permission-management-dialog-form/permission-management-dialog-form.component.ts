import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { MatRadioModule } from "@angular/material/radio";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { LocationService } from "@openapi/api/location.service";
import { Location } from "@openapi/model/location";
import {
	FacilityManagementDialogFormComponent
} from "@app/features/management/facility-management/facility-management-dialog-form/facility-management-dialog-form.component";
import { compareById } from "@app/core/utils/utils";
import { RequesterService } from "@openapi/api/requester.service";
import { PermissionService } from "@openapi/api/permission.service";
import { Requester } from "@openapi/model/requester";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { range } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
    selector: 'app-permission-management-dialog-form',
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
        MatDatepickerModule,
        MatFormFieldModule,
        FormsModule
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './permission-management-dialog-form.component.html',
    styleUrl: './permission-management-dialog-form.component.scss'
})
export class PermissionManagementDialogFormComponent implements OnInit {

	compareById: (o1: any, o2: any) => boolean = compareById;

	form!: FormGroup;
	locations: Location[] = [];
	requesters: Requester[] = [];

	constructor(
		public dialogRef: MatDialogRef<PermissionManagementDialogFormComponent>,
		private readonly dialog: MatDialog,
		private readonly permissionService: PermissionService,
		private readonly requesterService: RequesterService,
		private readonly locationService: LocationService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Location,
	) {
		this.buildFormGroup();
		this.findAllLocations();
		this.findAllRequesters();
	}

	ngOnInit(): void {
		this.form.patchValue(this.data);
	}

	onSubmit(): void {
		this.validateForm()

		if (this.data) {
			this.permissionService.addPermission(this.form.value).subscribe({
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

	private findAllRequesters(): void {
		this.requesterService.findAllRequesters().subscribe({
				next: (res: Requester[]) => {
					this.requesters = res;
				}
			}
		)
	}

	private findAllLocations(): void {
		this.locationService.findAllLocations().subscribe({
				next: (res: Location[]) => {
					this.locations = res;
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
			description: ['', Validators.required],
			location: ['', Validators.required],
			requester: ['', Validators.required],
			startDateTime: ['', Validators.required],
			endDateTime: ['', Validators.required],
		});
	}

	protected readonly range = range;
}
