import { Component } from '@angular/core';
import {
	LocationManagementDatatableComponent
} from "@app/features/resource-management/location-management/location-management-datatable/location-management-datatable.component";
import {
	LocationManagementFiltersComponent
} from "@app/features/resource-management/location-management/location-management-filters/location-management-filters.component";

@Component({
    selector: 'app-location-management',
    imports: [
        LocationManagementDatatableComponent,
        LocationManagementFiltersComponent
    ],
    templateUrl: './location-management.component.html',
    styleUrl: './location-management.component.scss'
})
export class LocationManagementComponent {


}
