import { Component } from '@angular/core';
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatFormField, MatFormFieldModule, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatToolbar, MatToolbarModule, MatToolbarRow } from "@angular/material/toolbar";
import { CommonModule } from "@angular/common";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import {
	KeyManagementDialogFormComponent
} from "@app/features/resource-management/key-management/key-management-dialog-form/key-management-dialog-form.component";
import { KeyManagementService } from "@app/features/resource-management/key-management/key-management.service";

@Component({
    selector: 'app-key-management-filters',
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule,
        MatToolbarModule,
    ],
    templateUrl: './key-management-filters.component.html',
    styleUrl: './key-management-filters.component.scss'
})
export class KeyManagementFiltersComponent {
	constructor(
		public dialog: MatDialog,
		private keyManagementService: KeyManagementService
	) {
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(KeyManagementDialogFormComponent, {
			data: {},
		});

		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	onSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.keyManagementService.onSearch(value);
	}

	onReload(): void {
		this.keyManagementService.onReload();
	}
}
