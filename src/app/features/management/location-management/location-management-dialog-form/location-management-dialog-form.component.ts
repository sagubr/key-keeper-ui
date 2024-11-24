import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { LocationService } from "@openapi/api/location.service";
import { FacilityService } from "@openapi/api/facility.service";
import { LocationType } from "@openapi/model/locationType";
import { Facility } from "@openapi/model/facility";
import { LocationTypeService } from "@openapi/api/locationType.service";
import { Location } from "@openapi/model/location";

@Component({
	selector: 'app-location-management-dialog-form',
	standalone: true,
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
	templateUrl: './location-management-dialog-form.component.html',
	styleUrl: './location-management-dialog-form.component.scss'
})
export class LocationManagementDialogFormComponent implements OnInit {

	form!: FormGroup;

	locationTypes: LocationType[] = [];
	facilities: Facility[] = [];

	constructor(
		public dialogRef: MatDialogRef<LocationManagementDialogFormComponent>,
		private readonly locationService: LocationService,
		private readonly facilityService: FacilityService,
		private readonly locationTypeService: LocationTypeService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Location,
	) {
		this.buildFormGroup();
		this.findAllLocationTypes();
		this.findAllFacilities();
	}

	ngOnInit(): void {
		this.form.patchValue(this.data);
	}

	onSubmit(): void {
		this.validateForm()

		if (this.data) {
			this.locationService.addLocation(this.form.value).subscribe({
				next: () => {
					this.form.reset();
					this.dialogRef.close(true);
				}
			});
		}
	}

	private findAllFacilities(): void {
		this.facilityService.findAllFacilities().subscribe({
				next: (res) => {
					this.facilities = res;
				}
			}
		)
	}

	private findAllLocationTypes(): void {
		this.locationTypeService.findAllLocationTypes().subscribe({
				next: (res) => {
					this.locationTypes = res;
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
			facility: ['', Validators.required],
			locationType: ['', Validators.required]
		});
	}

}
