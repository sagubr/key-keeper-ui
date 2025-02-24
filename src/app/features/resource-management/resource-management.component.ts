/*Angular Core */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/*Angular Material Modules*/
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/*Custom Components*/
import {
	JobTitleManagementComponent
} from "@app/features/resource-management/job-title-management/job-title-management.component";
import {
	FacilityManagementDatatableComponent
} from "@app/features/resource-management/facility-management/facility-management-datatable/facility-management-datatable.component";
import {
	LocationManagementDatatableComponent
} from "@app/features/resource-management/location-management/location-management-datatable/location-management-datatable.component";
import {
	LocationTypeDatatableComponent
} from "@app/features/resource-management/location-type/location-type-datatable/location-type-datatable.component";

@Component({
	selector: 'app-resource-management',
	imports: [
		CommonModule,
		MatTabsModule,
		MatIconModule,
		MatProgressBarModule,
		JobTitleManagementComponent,
		FacilityManagementDatatableComponent,
		LocationManagementDatatableComponent,
		LocationTypeDatatableComponent,
	],
	templateUrl: './resource-management.component.html',
	styleUrl: './resource-management.component.scss'
})
export class ResourceManagementComponent {
}
