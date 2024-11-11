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
	UsersManagementDialogFormComponent
} from '@app/features/management/user-management/users-management-dialog-form/users-management-dialog-form.component';
import { UserFilterService } from './users-filters.service';
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
	selector: 'app-users-management-filters',
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
	templateUrl: './users-management-filters.component.html',
	styleUrl: './users-management-filters.component.scss',
})
export class UsersManagementFiltersComponent {
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  animal: string = '';
  name: string = '';

	constructor(
		public dialog: MatDialog,
		private filterService: UserFilterService
	) {
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(UsersManagementDialogFormComponent, {
			data: {},
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log("closed")
		});
	}

	onSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.filterService.setFilter(value);
	}
}

export interface Food {
	value: string;
	viewValue: string;
}
