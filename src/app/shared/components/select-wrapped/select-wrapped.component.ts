import { Component, forwardRef, input, InputSignal, OnDestroy, OnInit, output, OutputEmitterRef } from '@angular/core';
import { MatFormFieldModule } from "@angular/material/form-field";
import {
	ControlValueAccessor,
	FormControl,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
	Validators
} from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgForOf, NgIf } from "@angular/common";
import { compareById } from "@app/core/utils/utils";

@Component({
	selector: 'app-select-wrapped',
	imports: [
		MatFormFieldModule,
		FormsModule,
		MatOptionModule,
		MatSelectModule,
		ReactiveFormsModule,
		MatProgressSpinnerModule,
		NgIf,
		NgForOf
	],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SelectWrappedComponent),
			multi: true,
		},
	],
	templateUrl: './select-wrapped.component.html',
	styleUrl: './select-wrapped.component.scss'
})
export class SelectWrappedComponent<T> implements ControlValueAccessor, OnInit, OnDestroy {


	readonly hint: InputSignal<string> = input.required<string>();
	readonly placeholder: InputSignal<string> = input.required<string>();
	readonly isLoading: InputSignal<boolean> = input.required<boolean>();
	readonly options: InputSignal<T[]> = input.required<T[]>();
	readonly displayFn = input<(option: T) => string>(
		(option) => (option ? option.toString() : '')
	);

	readonly change: OutputEmitterRef<T> = output<T>();

	selected = new FormControl<T | null>(null, [Validators.required]);

	private onChange: (value: T | null) => void = () => {
	};

	private onTouched: () => void = () => {
	};

	ngOnInit(): void {
	}

	ngOnDestroy(): void {
	}

	selectOption(option: T | null): void {
		this.selected.setValue(option);
		this.onChange(option);
		if (option) this.change.emit(option);
	}

	writeValue(value: T | null): void {
		this.selected.setValue(value);
	}

	registerOnChange(fn: (value: T | null) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		isDisabled ? this.selected.disable() : this.selected.enable();
	}

	getErrorMessage(): string {
		return this.selected.hasError('required') ? 'This field is required' : '';
	}

	protected readonly compareById = compareById;

}
