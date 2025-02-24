import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCard, MatCardActions, MatCardHeader, MatCardModule } from "@angular/material/card";

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
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-definitions',
	styleUrl: './definitions.component.scss',
	templateUrl: './definitions.component.html'
})
export class DefinitionsComponent {

	private _formBuilder = inject(FormBuilder);

	isChecked = true;
	formGroup = this._formBuilder.group({
		enableWifi: '',
		acceptTerms: ['', Validators.requiredTrue],
	});

	alertFormValues(formGroup: FormGroup) {
		alert(JSON.stringify(formGroup.value, null, 2));
	}

}
