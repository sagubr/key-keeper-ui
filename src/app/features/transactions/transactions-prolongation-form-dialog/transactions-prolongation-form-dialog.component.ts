import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { DialogWrappedInfo, DialogWrappedService } from "@app/shared/components/dialog-wrapped/dialog-wrapped.service";
import { ReservationService } from "@openapi/api/reservation.service";
import { provideNativeDateAdapter } from "@angular/material/core";
import { Reservation } from "@openapi/model/reservation";
import { ReservationProlongationCommand } from "@openapi/model/reservationProlongationCommand";
import { MatChipsModule } from "@angular/material/chips";

@Component({
	selector: 'app-transactions-prolongation-form-dialog',
	providers: [provideNativeDateAdapter()],
	imports: [
		CommonModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatTimepickerModule,
		FormsModule,
		MatChipsModule
	],
	templateUrl: './transactions-prolongation-form-dialog.component.html',
	styleUrl: './transactions-prolongation-form-dialog.component.scss'
})
export class TransactionsProlongationFormDialogComponent implements OnInit {

	formGroup!: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<TransactionsProlongationFormDialogComponent>,
		private readonly dialogWrapped: DialogWrappedService,
		private readonly reservationService: ReservationService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Reservation,
	) {
		this.buildFormGroup();
	}

	ngOnInit(): void {
		this.formGroup.patchValue(this.data);
	}

	onSubmit(): void {
		this.validateForm();

		const request = {
			reservationId: this.data.id,
			startDateTime: this.data.startDateTime,
			endDateTime: this.formGroup.get("endDateTime")?.value
		};

		if (this.data) {
			this.reservationService.updateReservation(request as ReservationProlongationCommand)
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

	addTimeToEndDateTime(minutes: number): void {
		const startDateTime = this.data.startDateTime;
		let endDateTime = this.formGroup.get('endDateTime')?.value;

		if (!endDateTime) {
			endDateTime = new Date(startDateTime || new Date());
		} else {
			endDateTime = new Date(endDateTime);
		}

		endDateTime.setMinutes(endDateTime.getMinutes() + minutes);
		this.formGroup.patchValue({ endDateTime });
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
			endDateTime: [null, Validators.required]
		});
	}
}
