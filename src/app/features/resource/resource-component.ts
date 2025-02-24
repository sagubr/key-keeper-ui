import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
	FacilityDatatableComponent
} from "@app/features/resource/facility/facility-datatable/facility-datatable.component";
import {
	LocationDatatableComponent
} from "@app/features/resource/location/location-datatable/location-datatable.component";
import {
	LocationTypeDatatableComponent
} from "@app/features/resource/location-type/location-type-datatable/location-type-datatable.component";
import {
	JobTitleDatatableComponent
} from "@app/features/resource/job-title/job-title-datatable/job-title-datatable.component";
import { NgModel } from "@angular/forms";

@Component({
	selector: 'app-resource-management',
	imports: [
		CommonModule,
		MatTabsModule,
		MatIconModule,
		MatProgressBarModule,
		FacilityDatatableComponent,
		LocationDatatableComponent,
		LocationTypeDatatableComponent,
		JobTitleDatatableComponent,

	],
	templateUrl: './resource-component.html',
	styleUrl: './resource-component.scss'
})
export class ResourceComponent {
}
