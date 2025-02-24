import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Location } from "@openapi/model/location";
import {
	FacilityDialogFormComponent
} from "@app/features/resource/facility/facility-dialog-form/facility-dialog-form.component";
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
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";

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

	form!: FormGroup;
	jobTitles: JobTitle[] = [];

	constructor(
		public dialogRef: MatDialogRef<RequesterFormDialogComponent>,
		private readonly dialog: MatDialog,
		private readonly requesterService: RequesterService,
		private readonly jobTitleService: JobTitleService,
		private readonly formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Location,
	) {
		this.buildFormGroup();
		this.findAllJobTitles();
	}

	ngOnInit(): void {
		this.form.patchValue(this.data);
	}


	readonly addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	readonly fruits = signal<String[]>([]);
	readonly announcer = inject(LiveAnnouncer);

	add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();

		// Add our fruit
		if (value) {
			this.fruits.update(fruits => [...fruits, value]);
		}

		// Clear the input value
		event.chipInput!.clear();
	}

	remove(fruit: String): void {
		this.fruits.update(fruits => {
			const index = fruits.indexOf(fruit);
			if (index < 0) {
				return fruits;
			}

			fruits.splice(index, 1);
			this.announcer.announce(`Removed ${ fruit }`);
			return [...fruits];
		});
	}

	edit(fruit: String, event: MatChipEditedEvent) {
		const value = event.value.trim();

		// Remove fruit if it no longer has a name
		if (!value) {
			this.remove(fruit);
			return;
		}

		// Edit existing fruit
		this.fruits.update(fruits => {
			const index = fruits.indexOf(fruit);
			if (index >= 0) {
				fruits[index] = value;
				return [...fruits];
			}
			return fruits;
		});
	}

	onSubmit(): void {
		this.validateForm()

		if (this.data) {
			this.requesterService.addRequester(this.form.value).subscribe({
				next: () => {
					this.form.reset();
					this.dialogRef.close(true);
				}
			});
		}
	}

	openDialogFacility(): void {
		const dialogRef = this.dialog.open(FacilityDialogFormComponent, {
			data: {},
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
		if (this.form.valid) {
			return;
		}
		this.form.markAllAsTouched();
		throw new Error();
	}

	private buildFormGroup(): void {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			email: [''],
			register: ['', Validators.required],
			jobTitle: ['', Validators.required],
			responsible: [false]
		});
	}
}
