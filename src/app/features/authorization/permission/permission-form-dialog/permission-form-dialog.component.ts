import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { MatRadioModule } from "@angular/material/radio";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { LocationService } from "@openapi/api/location.service";
import { Location } from "@openapi/model/location";
import { compareById } from "@app/core/utils/utils";
import { RequesterService } from "@openapi/api/requester.service";
import { PermissionService } from "@openapi/api/permission.service";
import { Requester } from "@openapi/model/requester";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { DialogWrappedInfo, DialogWrappedService } from "@app/shared/components/dialog-wrapped/dialog-wrapped.service";

@Component({
	selector: 'app-permission-form-dialog',
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
		MatFormFieldModule,
		MatTimepickerModule,
		MatDatepickerModule,
		FormsModule,
	],
	providers: [provideNativeDateAdapter()],
	templateUrl: './permission-form-dialog.component.html',
	styleUrl: './permission-form-dialog.component.scss'
})
export class PermissionFormDialogComponent implements OnInit {

	compareById: (o1: any, o2: any) => boolean = compareById;

	formGroup!: FormGroup;
	locations: Location[] = [];
	requesters: Requester[] = [];

	constructor(
		public dialogRef: MatDialogRef<PermissionFormDialogComponent>,
		private readonly dialogWrapped: DialogWrappedService,
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
		this.formGroup.patchValue(this.data);
	}

	onSubmit(): void {
		this.validateForm()
		if (this.data && this.data.id) {
			this.edit();
		} else {
			this.create();
		}
	}

	private create(): void {
		this.permissionService.createPermission(this.formGroup.value).subscribe({
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

	private edit(): void {
		const request = {
			...this.formGroup.value,
			id: this.data.id
		}

		this.permissionService.updatePermission(request).subscribe({
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

	private findAllRequesters(): void {
		this.requesterService.findAllRequester()
			.subscribe((res) => this.requesters = res)
	}

	private findAllLocations(): void {
		this.locationService.findByRestrictedFalseAndPublicFalse()
			.subscribe((res) => this.locations = res)
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
			description: [''],
			locations: [[], Validators.required],
			requesters: [[], Validators.required],
			startDateTime: ['', Validators.required],
			endDateTime: ['', Validators.required],
		});
	}

}
