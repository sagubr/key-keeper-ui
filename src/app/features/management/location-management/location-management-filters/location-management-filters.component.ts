import { Component } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { UsersManagementService } from "@app/features/management/user-management/users-management.service";
import {
	UsersManagementDialogFormComponent
} from "@app/features/management/user-management/users-management-dialog-form/users-management-dialog-form.component";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import {
	LocationManagementComponent
} from "@app/features/management/location-management/location-management.component";
import { LocationManagementService } from "@app/features/management/location-management/location-management.service";
import {
	LocationManagementDialogFormComponent
} from "@app/features/management/location-management/location-management-dialog-form/location-management-dialog-form.component";

@Component({
	selector: 'app-location-management-filters',
	standalone: true,
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
