import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";

@Component({
	imports: [
		MatButtonModule,
		MatExpansionModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatSlideToggleModule,
		FormsModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatTooltipModule,
		MatSelectModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-definitions',
	styleUrl: './definitions.component.scss',
	templateUrl: './definitions.component.html'
})
export class DefinitionsComponent {

	private _formBuilder = inject(FormBuilder);

	submitForm(form: FormGroup): void {

	}

	formGroup = this._formBuilder.group({
		autoEmail: [false],
		blockPending: [false, Validators.requiredTrue],
		tolerancePeriod: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
		enableLogs: [false],
		maxLoanPeriod: [{ value: 7, disabled: true }, [Validators.required, Validators.min(1)]],
	});

	fieldEnabled(field: any): void {
		if (field.disabled) {
			field.enable();
		} else {
			field.disable();
		}
	}

	alertFormValues(formGroup: FormGroup) {
		console.log(formGroup.get('tolerancePeriodEnabled'))
		alert(JSON.stringify(formGroup.value, null, 2));
	}

}
