/*Angular Core */
import { Component } from '@angular/core';

/**Custom Components */
import {
	UserManagementDatatableComponent
} from '@app/features/settings/user-management/user-management-datatable/user-management-datatable.component';
import {
	MatAccordion, MatExpansionModule,
	MatExpansionPanel,
	MatExpansionPanelDescription,
	MatExpansionPanelHeader
} from "@angular/material/expansion";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";

@Component({
	selector: 'app-user-management',
	imports: [UserManagementDatatableComponent, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule],
	templateUrl: './user-management.component.html',
	styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {

}
