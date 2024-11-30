/*Angular Core*/
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/*Angular Material*/
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

/*Angular Material Modules*/
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

/*Custom Components*/
import {
	UserManagementDialogFormComponent
} from '@app/features/management/user-management/user-management-dialog-form/user-management-dialog-form.component';
import { UserManagementService } from '../user-management.service';
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
    selector: 'app-user-management-filters',
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
    templateUrl: './user-management-filters.component.html',
    styleUrl: './user-management-filters.component.scss'
})
export class UserManagementFiltersComponent {

	constructor(
		public dialog: MatDialog,
		private usersManagementService: UserManagementService
	) {
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(UserManagementDialogFormComponent, {
			data: {},
		});

		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	onSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.usersManagementService.onSearch(value);
	}

	onReload(): void {
		this.usersManagementService.onReload();
	}

}
