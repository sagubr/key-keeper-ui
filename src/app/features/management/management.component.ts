/*Angular Core */
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

/*Angular Material Modules*/
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/*Custom Components*/
import { UserManagementComponent } from "@app/features/management/user-management/user-management.component";
import {
	LocationManagementComponent
} from "@app/features/management/location-management/location-management.component";
import {
	JobTitleManagementComponent
} from "@app/features/management/job-title-management/job-title-management.component";

@Component({
	selector: 'app-management',
	standalone: true,
	imports: [
		CommonModule,
		MatTabsModule,
		MatIconModule,
		MatProgressBarModule,
		RouterLink,
		UserManagementComponent,
		LocationManagementComponent,
		JobTitleManagementComponent,
	],
	templateUrl: './management.component.html',
	styleUrl: './management.component.scss',
})
export class ManagementComponent {
}
