import { Component } from '@angular/core';
import {
	PermissionManagementDatatableComponent
} from "@app/features/authorization-management/permission-management/permission-management-datatable/permission-management-datatable.component";
import {
	PermissionManagementFiltersComponent
} from "@app/features/authorization-management/permission-management/permission-management-filters/permission-management-filters.component";

@Component({
    selector: 'app-permission-management',
    imports: [
        PermissionManagementDatatableComponent,
        PermissionManagementFiltersComponent
    ],
    templateUrl: './permission-management.component.html',
    styleUrl: './permission-management.component.scss'
})
export class PermissionManagementComponent {

}
