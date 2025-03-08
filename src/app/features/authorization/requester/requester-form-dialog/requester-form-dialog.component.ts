import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Location } from "@openapi/model/location";
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
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DialogWrappedInfo, DialogWrappedService } from "@app/shared/components/dialog-wrapped/dialog-wrapped.service";
import { Requester } from "@openapi/model/requester";

@Component({
	selector: 'app-requester-form-dialog',
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
		MatChipsModule,
		MatSlideToggleModule,
		MatTooltipModule,
	],
	templateUrl: './requester-form-dialog.component.html',
	styleUrl: './requester-form-dialog.component.scss'
})
export class RequesterFormDialogComponent implements OnInit {

	compareById: (o1: any, o2: any) => boolean = compareById;

	jobTitles: JobTitle[] = [];
	formGroup!: FormGroup;

	ngOnInit(): void {
		this.formGroup.patchValue(this.data);
	}

	constructor(
		public dialogRef: MatDialogRef<RequesterFormDialogComponent>,
		private readonly dialogWrapped: DialogWrappedService,
		private readonly requesterService: RequesterService,
		private readonly jobTitleService: JobTitleService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Location) {

		this.buildFormGroup();
		this.findAllJobTitles();
	}

	readonly addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;

	removeKeyword(keyword: string): void {
		const currentEmail = this.formGroup.get('emails')!.value;
		const index = currentEmail.indexOf(keyword);
		if (index >= 0) {
			currentEmail.splice(index, 1);
			this.formGroup.get('emails')!.setValue([...currentEmail]);
		}
	}

	add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		if (value) {
			const currentEmail: string[] = this.formGroup.get('emails')!.value;
			this.formGroup.get('emails')!.setValue([...currentEmail, value]);
		}
		event.chipInput!.clear();
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
		this.requesterService.createRequester(this.formGroup.value).subscribe({
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
		} as Requester

		this.requesterService.updateRequester(request).subscribe({
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

	private findAllJobTitles(): void {
		this.jobTitleService.findAllJobTitle().subscribe({
				next: (res: JobTitle[]) => {
					this.jobTitles = res;
				}
			}
		)
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
			name: ['', Validators.required],
			emails: [[]],
			register: ['', Validators.required],
			jobTitle: ['', Validators.required],
			responsible: [false]
		});
	}

}
