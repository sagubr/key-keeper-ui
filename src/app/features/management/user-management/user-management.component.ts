/*Angular Core */
import { Component } from '@angular/core';

/**Custom Components */
import {
	UserManagementDatatableComponent
} from '@app/features/management/user-management/user-management-datatable/user-management-datatable.component';
import {
	UserManagementFiltersComponent
} from "@app/features/management/user-management/user-management-filters/user-management-filters.component";

@Component({
    selector: 'app-user-management',
    imports: [UserManagementDatatableComponent, UserManagementFiltersComponent],
    templateUrl: './user-management.component.html',
    styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {

}
