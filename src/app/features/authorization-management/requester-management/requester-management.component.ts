import { Component } from '@angular/core';
import {
	RequesterManagementDatatableComponent
} from "@app/features/authorization-management/requester-management/requester-management-datatable/requester-management-datatable.component";
import {
	LocationManagementFiltersComponent
} from "@app/features/resource-management/location-management/location-management-filters/location-management-filters.component";
import {
	RequesterManagementFiltersComponent
} from "@app/features/authorization-management/requester-management/requester-management-filters/requester-management-filters.component";

@Component({
    selector: 'app-requester-management',
    imports: [
        RequesterManagementDatatableComponent,
        RequesterManagementFiltersComponent
    ],
    templateUrl: './requester-management.component.html',
    styleUrl: './requester-management.component.scss'
})
export class RequesterManagementComponent {

}
