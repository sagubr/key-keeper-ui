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
import { RequesterManagementService } from "@app/features/authorization-management/requester-management/requester-management.service";
import {
	RequesterManagementDialogFormComponent
} from "@app/features/authorization-management/requester-management/requester-management-dialog-form/requester-management-dialog-form.component";

@Component({
    selector: 'app-requester-management-filters',
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
    templateUrl: './requester-management-filters.component.html',
    styleUrl: './requester-management-filters.component.scss'
})
export class RequesterManagementFiltersComponent {

	constructor(
		public dialog: MatDialog,
		private requesterManagementService: RequesterManagementService
	) {
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(RequesterManagementDialogFormComponent, {
			data: {},
		});

		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	onSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.requesterManagementService.onSearch(value);
	}

	onReload(): void {
		this.requesterManagementService.onReload();
	}

}
