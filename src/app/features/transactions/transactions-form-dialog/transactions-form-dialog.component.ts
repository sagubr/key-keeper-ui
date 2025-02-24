import { ChangeDetectionStrategy, Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton, MatButtonModule } from "@angular/material/button";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogActions, MatDialogClose,
	MatDialogContent, MatDialogModule,
	MatDialogRef,
	MatDialogTitle
} from "@angular/material/dialog";
import { MatError, MatFormField, MatFormFieldModule, MatHint, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatNativeDateModule, MatOption, provideNativeDateAdapter } from "@angular/material/core";
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { CommonModule, NgForOf, NgIf } from "@angular/common";
import { LocationType } from "@openapi/model/locationType";
import { Facility } from "@openapi/model/facility";
import { LocationService } from "@openapi/api/location.service";
import { FacilityService } from "@openapi/api/facility.service";
import { LocationTypeService } from "@openapi/api/locationType.service";
import { Location } from "@openapi/model/location";
import {
	FacilityDialogFormComponent
} from "@app/features/resource/facility/facility-dialog-form/facility-dialog-form.component";
import { compareById } from "@app/core/utils/utils";
import { PermissionService } from "@openapi/api/permission.service";
import { ReservationService } from "@openapi/api/reservation.service";
import { Permission } from "@openapi/model/permission";
import { Reservation } from "@openapi/model/reservation";
import { RequesterService } from "@openapi/api/requester.service";
import { Requester } from "@openapi/model/requester";
import {
	MatDatepicker,
	MatDatepickerInput, MatDatepickerModule,
	MatDatepickerToggle,
	MatDateRangeInput,
	MatDateRangePicker,
	MatEndDate,
	MatStartDate
} from "@angular/material/datepicker";
import {
	MatTimepicker,
	MatTimepickerInput,
	MatTimepickerModule,
	MatTimepickerToggle
} from "@angular/material/timepicker";
import { MatRadioModule } from "@angular/material/radio";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { Status } from "@openapi/model/status";
import { MatStep, MatStepperModule } from "@angular/material/stepper";

export interface StatusEnum {
	value?: Status,
	label?: string
}

@Component({
	selector: 'app-transactions-form-dialog',
	providers: [provideNativeDateAdapter()],
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
		MatTimepickerModule,
		FormsModule,
		MatStepperModule,
	],
	templateUrl: './transactions-form-dialog.component.html',
	styleUrl: './transactions-form-dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsFormDialogComponent implements OnInit {

	compareById: (o1: any, o2: any) => boolean = compareById;


	private _formBuilder = inject(FormBuilder);

	firstFormGroup = this._formBuilder.group({
		requester: ['', Validators.required],
		permission: [{ value: '', disabled: true }, Validators.required],
		status: [Status.Loan, Validators.required],
	});
	secondFormGroup = this._formBuilder.group({
		startDateTime: ['', Validators.required],
		endDateTime: ['', Validators.required]
	});


	form!: FormGroup;
	reservation: Reservation[] = [];
	permission: Permission[] = [];
	requester: Requester[] = [];
	status: StatusEnum[] = [
		{
			value: Status.Loan,
			label: 'EMPRÉSTIMO'
		},
		{
			value: Status.Scheduled,
			label: "RESERVADO"
		}
	]
	permissionsEnabled = false;

	constructor(
		public dialogRef: MatDialogRef<TransactionsFormDialogComponent>,
		private readonly dialog: MatDialog,
		private readonly reservationService: ReservationService,
		private readonly permissionService: PermissionService,
		private readonly requesterService: RequesterService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Location,
	) {
		this.buildFormGroup();
		this.findAllRequesters();
	}

	ngOnInit(): void {
		this.form.patchValue(this.data);
	}

	onSubmit(): void {
		this.validateForm()
		if (this.data) {
			this.reservationService.addReservation(this.form.value).subscribe({
				next: () => {
					this.form.reset();
					this.dialogRef.close(true);
				}
			});
		}
	}

	onRequesterChange(selectedRequester: any): void {
		if (selectedRequester) {
			this.form.get('permission')?.enable();
			this.findAllPermissions(selectedRequester);
		} else {
			this.form.get('permission')?.disable();
			this.permission = [];
		}
	}

	private findAllRequesters(): void {
		this.requesterService.findAllRequesters().subscribe({
				next: (res: Requester[]) => {
					this.requester = res;
				}
			}
		)
	}

	private findAllPermissions(requester: Requester): void {
		this.permissionService.findByRequester(requester).subscribe({
				next: (res: Permission[]) => {
					this.permission = res;
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
			requester: ['', Validators.required],
			permission: [{ value: '', disabled: true }, Validators.required],
			status: [Status.Loan, Validators.required],
			startDateTime: ['', Validators.required],
			endDateTime: ['', Validators.required]
		});
	}
}
