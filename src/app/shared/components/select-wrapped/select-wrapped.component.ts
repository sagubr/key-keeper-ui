import { Component, input, InputSignal, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Columns } from "@app/shared/components/table-wrapped-table/table-wrapper-table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { compareById } from "@app/core/utils/utils";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
	selector: 'app-select-wrapped',
	imports: [
		MatFormFieldModule,
		FormsModule,
		MatOptionModule,
		MatSelectModule,
		ReactiveFormsModule,
		MatProgressSpinnerModule
	],
	templateUrl: './select-wrapped.component.html',
	styleUrl: './select-wrapped.component.scss'
})
export class SelectWrappedComponent<T> implements OnInit, OnDestroy {

	@ViewChild('selectControl') selectControl: any;

	hint = "list of options";
	placeholder = "Choose one";
	selected = new FormControl(null, [Validators.required]);
	isLoading = false;

	readonly options: InputSignal<Columns<T>[]> = input.required<Columns<T>[]>();

	protected readonly compareById = compareById;

	ngOnInit() {
	}

	ngOnDestroy() {
	}

	getErrorMessage(): string {
		if (this.selected.hasError('required')) {
			return 'this field is required';
		}
		return '';
	}

}
