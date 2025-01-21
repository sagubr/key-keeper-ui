import { Component } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDialog } from "@angular/material/dialog";
import {
	LocationManagementService
} from "@app/features/resource-management/location-management/location-management.service";
import {
	TransactionsManagementDialogFormComponent
} from "@app/features/transactions-management/transactions-management-dialog-form/transactions-management-dialog-form.component";

@Component({
  selector: 'app-transactions-management-filters',
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatToolbarModule,
    ],
  templateUrl: './transactions-management-filters.component.html',
  styleUrl: './transactions-management-filters.component.scss'
})
export class TransactionsManagementFiltersComponent {

	constructor(
		public dialog: MatDialog,
		private locationManagementService: LocationManagementService
	) {
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(TransactionsManagementDialogFormComponent, {
			minWidth: '540px',
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
