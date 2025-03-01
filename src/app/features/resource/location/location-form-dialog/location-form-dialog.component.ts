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
import { compareById } from "@app/core/utils/utils";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { Requester } from "@openapi/model/requester";
import { RequesterService } from "@openapi/api/requester.service";
import { DialogWrappedInfo, DialogWrappedService } from "@app/shared/components/dialog-wrapped/dialog-wrapped.service";

@Component({
	selector: 'app-location-form-dialog',
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
		MatExpansionModule,
		MatSlideToggleModule,
		MatTooltipModule,
		MatTimepickerModule
	],
	providers: [provideNativeDateAdapter()],
	templateUrl: './location-form-dialog.component.html',
	styleUrl: './location-form-dialog.component.scss'
})
export class LocationFormDialogComponent implements OnInit {

	compareById: (o1: any, o2: any) => boolean = compareById;

	form!: FormGroup;
	locationTypes: LocationType[] = [];
	facilities: Facility[] = [];
	responsibles: Requester[] = [];

	constructor(
		public dialogRef: MatDialogRef<LocationFormDialogComponent>,
		private readonly dialogWrapped: DialogWrappedService,
		private readonly locationService: LocationService,
		private readonly facilityService: FacilityService,
		private readonly locationTypeService: LocationTypeService,
		private readonly requesterService: RequesterService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Location,
	) {
		this.buildFormGroup();
		this.findAllLocationTypes();
		this.findAllFacilities();
		this.findAllResponsibles();
	}

	ngOnInit(): void {
		this.form.patchValue(this.data);
	}

	onSubmit(): void {
		this.validateForm()
		console.log(this.form.value)
		if (this.data) {
			this.locationService.createLocation(this.form.value).subscribe({
				next: () => {
					this.form.reset();
					this.dialogRef.close(true);
					this.dialogWrapped.openFeedback(
						{
							title: 'Salvo com sucesso',
							message: ``,
							icon: "success"
						} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
				},
				error: () => {
					this.dialogWrapped.openFeedback(
						{
							title: 'Não foi possível concluir o registro',
							message: ``,
							icon: "warning"
						} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
				}
			});
		}
	}

	private findAllFacilities(): void {
		this.facilityService.findAllFacilities()
			.subscribe((res) => this.facilities = res)
	}

	private findAllLocationTypes(): void {
		this.locationTypeService.findAllLocationType()
			.subscribe((res) => this.locationTypes = res)
	}

	private findAllResponsibles(): void {
		this.requesterService.findAllRequesterByResponsibleTrue()
			.subscribe((res) => this.responsibles = res)
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
			description: [''],
			facility: [null, Validators.required],
			locationType: [null, Validators.required],
			maxCapacity: [null, [Validators.min(1)]],
			restricted: [false],
			publicAccess: [false],
			openingTime: [null],
			closingTime: [null],
			responsibles: [[]]
		});
	}

	checkSlideToggleDisabled(event: MatSlideToggleChange, controlName: string): void {
		event.checked
			? this.form.get(controlName)?.disable()
			: this.form.get(controlName)?.enable()
	}

}
