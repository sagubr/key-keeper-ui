import { Component } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";

import {
	LocationManagementDialogFormComponent
} from "@app/features/resource-management/location-management/location-management-dialog-form/location-management-dialog-form.component";
import { LocationManagementService } from "@app/features/resource-management/location-management/location-management.service";

@Component({
    selector: 'app-location-management-filters',
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
    templateUrl: './location-management-filters.component.html',
    styleUrl: './location-management-filters.component.scss'
})
export class LocationManagementFiltersComponent {

	constructor(
		public dialog: MatDialog,
		private locationManagementService: LocationManagementService
	) {
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(LocationManagementDialogFormComponent, {
			data: {},
		});

		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	onSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.locationManagementService.onSearch(value);
	}

	onReload(): void {
		this.locationManagementService.onReload();
	}

}
