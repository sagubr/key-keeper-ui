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
import { MatToolbarModule } from "@angular/material/toolbar";

/*Custom Components*/
import {
	JobTitleManagementDialogFormComponent
} from "@app/features/management/job-title-management/job-title-management-dialog-form/job-title-management-dialog-form.component";
import { JobTitleManagementService } from "@app/features/management/job-title-management/job-title-management.service";

@Component({
    selector: 'app-job-title-management-filters',
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
    templateUrl: './job-title-management-filters.component.html',
    styleUrl: './job-title-management-filters.component.scss'
})
export class JobTitleManagementFiltersComponent {

	constructor(
		public dialog: MatDialog,
		private jobTitleManagementService: JobTitleManagementService,
	) {
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(JobTitleManagementDialogFormComponent, {
			data: {},
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log("closed")
		});
	}

	onSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.jobTitleManagementService.onSearch(value);
	}

	onReload(): void {
		this.jobTitleManagementService.onReload();
	}

}
