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
} from "@app/features/resource/job-title-management/job-title-management.component";
import {
	FacilityManagementDatatableComponent
} from "@app/features/resource/facility-management/facility-management-datatable/facility-management-datatable.component";
import {
	LocationDatatableComponent
} from "@app/features/resource/location/location-datatable/location-datatable.component";
import {
	LocationTypeDatatableComponent
} from "@app/features/resource/location-type/location-type-datatable/location-type-datatable.component";

@Component({
	selector: 'app-resource-management',
	imports: [
		CommonModule,
		MatTabsModule,
		MatIconModule,
		MatProgressBarModule,
		JobTitleManagementComponent,
		FacilityManagementDatatableComponent,
		LocationDatatableComponent,
		LocationTypeDatatableComponent,
	],
	templateUrl: './resource-component.html',
	styleUrl: './resource-component.scss'
})
export class ResourceComponent {
}
