import { Component } from '@angular/core';
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatFormField, MatFormFieldModule, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatToolbar, MatToolbarModule, MatToolbarRow } from "@angular/material/toolbar";
import { MatDialog } from "@angular/material/dialog";
import { LocationManagementService } from "@app/features/resource-management/location-management/location-management.service";
import {
	LocationManagementDialogFormComponent
} from "@app/features/resource-management/location-management/location-management-dialog-form/location-management-dialog-form.component";
import {
	PermissionManagementComponent
} from "@app/features/authorization-management/permission-management/permission-management.component";
import {
	PermissionManagementDialogFormComponent
} from "@app/features/authorization-management/permission-management/permission-management-dialog-form/permission-management-dialog-form.component";
import {
	PermissionManagementService
} from "@app/features/authorization-management/permission-management/permission-management.service";

@Component({
    selector: 'app-permission-management-filters',
    imports: [
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatToolbarModule,
    ],
    templateUrl: './permission-management-filters.component.html',
    styleUrl: './permission-management-filters.component.scss'
})
export class PermissionManagementFiltersComponent {

	constructor(
		public dialog: MatDialog,
		private permissionManagementService: PermissionManagementService
	) {
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(PermissionManagementDialogFormComponent, {
			data: {},
		});

		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	onSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.permissionManagementService.onSearch(value);
	}

	onReload(): void {
		this.permissionManagementService.onReload();
	}

}
