/*Angular Core */
import { Component } from '@angular/core';

/**Custom Components */
import {
	UsersManagementDatatableComponent
} from '@app/features/management/user-management/users-management-datatable/users-management-datatable.component';
import {
	UsersManagementFiltersComponent
} from "@app/features/management/user-management/users-management-filters/users-management-filters.component";

@Component({
	selector: 'app-users-management',
	standalone: true,
	imports: [UsersManagementDatatableComponent, UsersManagementFiltersComponent],
	templateUrl: './users-management.component.html',
	styleUrl: './users-management.component.scss',
})
export class UsersManagementComponent {

}
