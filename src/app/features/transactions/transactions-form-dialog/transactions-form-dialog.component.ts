import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
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
import { finalize } from "rxjs";
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
		SelectWrappedComponent
	],
	templateUrl: './transactions-form-dialog.component.html',
	styleUrl: './transactions-form-dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsFormDialogComponent implements OnInit {

	compareById: (o1: any, o2: any) => boolean = compareById;

	firstFormGroup!: FormGroup;
	secondFormGroup!: FormGroup;

	permissions: PermissionLocationSummaryDto[] = [];
	requesters: Requester[] = [];
	keys: Key[] = [];
	status: Status[] = Object.values(Status)

	loadings: { permissions?: boolean, requesters?: boolean, keys?: boolean } = {
		permissions: false,
		requesters: false,
		keys: false
	}

	userDisplay = (user: PermissionLocationSummaryDto) => user.location.name;

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
								message: `${err.error.details}`,
								icon: "danger"
							} as DialogWrappedInfo).afterClosed().subscribe(res => console.log(res));
					}
				});
		}
	}

	onRequesterChange(selectedRequester: any): void {
		this.firstFormGroup.get('permission')?.reset()
		this.firstFormGroup.get('permission')?.enable();
		this.findAllPermissions(selectedRequester);
		this.findByRestrictedFalseAndPublicTrue();
	}

	onPermissionChange(selectedPermission: PermissionLocationSummaryDto): void {
		this.firstFormGroup.get('key')?.reset()
		this.firstFormGroup.get('key')?.enable();
		this.findByLocation(selectedPermission.location);
	}

	private findRequester(): void {
		this.loadings.requesters = true;
		this.requesterService.findByBlockedFalse()
			.pipe(finalize(() => this.loadings.requesters = false))
			.subscribe((res) => this.requesters = res)
	}

	private findAllPermissions(requester: Requester): void {
		this.loadings.permissions = true;
		this.permissionService.findByRequestersIdAndEndDateTimeAfter(requester.id!)
			.pipe(finalize(() => this.loadings.permissions = false))
			.subscribe((res) => this.permissions = res);
		console.log("com permissao", this.permissions)
		this.findByRequestersIdRestrictedTrue(requester)
	}

	private findByRequestersIdRestrictedTrue(requester: Requester): void {
		this.loadings.permissions = true;
		this.locationService.findByResponsiblesId(requester.id!)
			.pipe(finalize(() => this.loadings.permissions = false))
			.subscribe((res) => {
				res.forEach(it => {
					const alreadyAdded = this.permissions.some(p => p.location.id === it.id);
					if (!alreadyAdded) {
						this.permissions.push({ location: it } as PermissionLocationSummaryDto);
					}
					console.log("restrita", this.permissions)
				});
				}
			);
	}

	private findByRestrictedFalseAndPublicTrue(): void {
		this.loadings.permissions = true;
		this.locationService.findByRestrictedFalseAndPublicTrue()
			.pipe(finalize(() => this.loadings.permissions = false))
			.subscribe((res) => {
				res.forEach(it => {
					const alreadyAdded = this.permissions.some(p => p.location.id === it.id);
					if (!alreadyAdded) {
						this.permissions.push({ location: it } as PermissionLocationSummaryDto);
					}
					console.log("publica", this.permissions)
				});
			});
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
