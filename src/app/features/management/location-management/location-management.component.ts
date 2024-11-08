import { Component } from '@angular/core';
import {
	LocationManagementDatatableComponent
} from "@app/features/management/location-management/location-management-datatable/location-management-datatable.component";

@Component({
	selector: 'app-location-management',
	standalone: true,
	imports: [
		LocationManagementDatatableComponent
	],
	templateUrl: './location-management.component.html',
	styleUrl: './location-management.component.scss'
})
export class LocationManagementComponent {


}
