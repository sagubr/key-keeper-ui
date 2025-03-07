import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
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
import { RequesterService } from "@openapi/api/requester.service";
import { Requester } from "@openapi/model/requester";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { MatRadioModule } from "@angular/material/radio";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { Status } from "@openapi/model/status";
import { MatStepperModule } from "@angular/material/stepper";
import { PermissionLocationSummaryDto } from "@openapi/model/permissionLocationSummaryDto";
import { ReservationCommand } from "@openapi/model/reservationCommand";
import { LocationService } from "@openapi/api/location.service";
import { KeyService } from "@openapi/api/key.service";
import { Key } from "@openapi/model/key";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { finalize, forkJoin } from "rxjs";
import { DialogWrappedInfo, DialogWrappedService } from "@app/shared/components/dialog-wrapped/dialog-wrapped.service";
import { SelectWrappedComponent } from "@app/shared/components/select-wrapped/select-wrapped.component";

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
		MatProgressSpinnerModule,
		SelectWrappedComponent,
	],
	templateUrl: './transactions-form-dialog.component.html',
	styleUrl: './transactions-form-dialog.component.scss'
})
export class TransactionsFormDialogComponent implements OnInit {

	compareById: (o1: any, o2: any) => boolean = compareById;

	firstFormGroup!: FormGroup;
	secondFormGroup!: FormGroup;

	permissions: PermissionLocationSummaryDto[] = [];
	requesters: Requester[] = [];
	keys: Key[] = [];
	status: Status[] = ["AGENDADO", "EMPRESTIMO"]

	loadings: { permissions: boolean, requesters: boolean, keys: boolean } = {
		permissions: false,
		requesters: false,
		keys: false
	}

	permissionDisplay = (permission: PermissionLocationSummaryDto) => `${ permission.location.name } (${ permission.location.facility.name })`;
	requesterDisplay = (requester: Requester) => requester.name;
	keyDisplay = (key: Key) => `${ key.code } - ${ key.description }`;

	constructor(
		public dialogRef: MatDialogRef<TransactionsFormDialogComponent>,
		private readonly dialogWrapped: DialogWrappedService,
		private readonly reservationService: ReservationService,
		private readonly permissionService: PermissionService,
		private readonly keyService: KeyService,
		private readonly locationService: LocationService,
		private readonly requesterService: RequesterService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Location,
	) {
		this.buildFormGroup();
		this.findRequester();
	}

	ngOnInit(): void {
		this.firstFormGroup.patchValue(this.data);
	}

	onSubmit(): void {
		this.validateForm();
		const request = {
			...this.firstFormGroup.value,
			...this.secondFormGroup.value
		};

		if (this.data) {
			this.reservationService.createReservation(request as ReservationCommand)
				.subscribe({
					next: () => {
						this.dialogRef.close()
						this.dialogWrapped.openFeedback(
							{
								title: 'Salvo com sucesso',
								message: ``,
								icon: "success"
							} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
					},
					error: (err) => {
						console.log(err)
						this.dialogWrapped.openFeedback(
							{
								title: 'Não foi possível concluir o registro',
								message: `${ err.error.details }`,
								icon: "danger"
							} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
					}
				});
		}
	}

	onRequesterChange(selectedRequester: any): void {
		this.firstFormGroup.get('permission')?.reset()
		this.firstFormGroup.get('permission')?.enable();
		this.findAllLocationsByRequester(selectedRequester);
	}

	onPermissionChange(selectedPermission: PermissionLocationSummaryDto): void {
		this.firstFormGroup.get('key')?.reset()
		this.firstFormGroup.get('key')?.enable();
		this.findByLocation(selectedPermission.location);
	}

	private findRequester(): void {
		this.loadings.requesters = true;
		this.requesterService.findByBlockedFalse()
			.pipe(finalize(() => {
				this.loadings.requesters = false;
			}))
			.subscribe((res) => this.requesters = res);
	}

	private findAllLocationsByRequester(requester: Requester): void {
		this.loadings.permissions = true;

		const permissions$ = this.permissionService.findByRequestersIdAndEndDateTimeAfter(requester.id!);
		const restrictedLocations$ = this.locationService.findByResponsiblesId(requester.id!);
		const publicLocations$ = this.locationService.findByRestrictedFalseAndPublicTrue();

		forkJoin([permissions$, restrictedLocations$, publicLocations$])
			.pipe(finalize(() => this.loadings.permissions = false))
			.subscribe(([permissions, restricted, publicLocations]) => {
				const combinedPermissions = [
					...permissions,
					...restricted.map(location => ({ location } as PermissionLocationSummaryDto)),
					...publicLocations.map(location => ({ location } as PermissionLocationSummaryDto))
				];
				this.permissions = this.removeDuplicatesById(combinedPermissions);
			});
	}

	private removeDuplicatesById(array: PermissionLocationSummaryDto[]): PermissionLocationSummaryDto[] {
		return array.filter((item, index, self) =>
			index === self.findIndex((t) => t.location.id === item.location.id)
		);
	}

	private findByLocation(location: Location): void {
		this.loadings.keys = true;

		this.keyService.findByLocation(location)
			.pipe(finalize(() => this.loadings.keys = false))
			.subscribe((res) => this.keys = res);
		console.log("res", this.keys)
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
			permission: [{ value: [], disabled: true }, Validators.required],
			key: [{ value: [], disabled: true }, Validators.required],
			status: [Status.Agendado, Validators.required],
		});
		this.secondFormGroup = this.formBuilder.group({
			startDateTime: [new Date(), Validators.required],
			endDateTime: [new Date(), Validators.required]
		});
	}
}
