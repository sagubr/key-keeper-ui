import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { Location } from "@openapi/model/location";
import { compareById } from "@app/core/utils/utils";
import { PermissionService } from "@openapi/api/permission.service";
import { ReservationService } from "@openapi/api/reservation.service";
import { Permission } from "@openapi/model/permission";
import { RequesterService } from "@openapi/api/requester.service";
import { Requester } from "@openapi/model/requester";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { MatRadioModule } from "@angular/material/radio";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { Status } from "@openapi/model/status";
import { MatStepperModule } from "@angular/material/stepper";
import { Reservation } from "@openapi/model/reservation";

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

	firstFormGroup!: FormGroup;
	secondFormGroup!: FormGroup;

	locations: Location[] = [];
	requester: Requester[] = [];
	status: Status[] = Object.values(Status)

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
		this.firstFormGroup.patchValue(this.data);

	}

	// get permission(): Permission | null {
	// 	return this.firstFormGroup.get('permission')?.value || null;
	// }

	onSubmit(): void {
		this.validateForm();
		const request = {
			...this.firstFormGroup.value,
			...this.secondFormGroup.value
		};

		console.log(request)

		if (this.data) {
			this.reservationService.createReservation(request as Reservation).subscribe({
				next: () => {
					this.dialogRef.close(true);
				}
			});
		}
	}

	onRequesterChange(selectedRequester: any): void {
		if (selectedRequester) {
			this.firstFormGroup.get('permission')?.enable();
			this.findAllPermissions(selectedRequester);
		}
	}

	private findAllRequesters(): void {
		this.requesterService.findAllRequesterByResponsibleTrue().subscribe({
				next: (res: Requester[]) => {
					this.requester = res;
				}
			}
		)
	}

	private findAllPermissions(requester: Requester): void {
		this.permissionService.findByRequesterPermission(requester).subscribe({
				next: (res: Permission[]) => {
					res.forEach( (permission) => {
						permission.locations?.forEach( (location) => this.locations.push(location))
					})
				}
			}
		)
	}

	private validateForm(): void {
		if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
			return;
		}
		this.secondFormGroup.markAllAsTouched();
		throw new Error();
	}

	private buildFormGroup(): void {
		this.firstFormGroup = this.formBuilder.group({
			requester: ['', Validators.required],
			permission: ['', Validators.required],
			status: [Status.Agendado, Validators.required],
		});
		this.secondFormGroup = this.formBuilder.group({
			startDateTime: [new Date(), Validators.required],
			endDateTime: [new Date(), Validators.required]
		});
	}
}
