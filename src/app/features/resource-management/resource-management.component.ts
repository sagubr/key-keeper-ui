/*Angular Core */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/*Angular Material Modules*/
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/*Custom Components*/
import {
	LocationManagementComponent
} from "@app/features/resource-management/location-management/location-management.component";
import {
	JobTitleManagementComponent
} from "@app/features/resource-management/job-title-management/job-title-management.component";

@Component({
    selector: 'app-resource-management',
	imports: [
		CommonModule,
		MatTabsModule,
		MatIconModule,
		MatProgressBarModule,
		LocationManagementComponent,
		JobTitleManagementComponent,
	],
    templateUrl: './resource-management.component.html',
    styleUrl: './resource-management.component.scss'
})
export class ResourceManagementComponent {
}
