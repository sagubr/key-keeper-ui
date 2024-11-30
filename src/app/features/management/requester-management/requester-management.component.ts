import { Component } from '@angular/core';
import {
	RequesterManagementDatatableComponent
} from "@app/features/management/requester-management/requester-management-datatable/requester-management-datatable.component";
import {
    LocationManagementFiltersComponent
} from "@app/features/management/location-management/location-management-filters/location-management-filters.component";
import {
	RequesterManagementFiltersComponent
} from "@app/features/management/requester-management/requester-management-filters/requester-management-filters.component";

@Component({
    selector: 'app-requester',
    imports: [
        RequesterManagementDatatableComponent,
        LocationManagementFiltersComponent,
        RequesterManagementFiltersComponent
    ],
    templateUrl: './requester-management.component.html',
    styleUrl: './requester-management.component.scss'
})
export class RequesterManagementComponent {

}
