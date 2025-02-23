/*Angular Core */
import { Component } from '@angular/core';

/**Custom Components */
import {
	UserManagementDatatableComponent
} from '@app/features/settings/user-management/user-management-datatable/user-management-datatable.component';
import {
	MatAccordion,
	MatExpansionPanel,
	MatExpansionPanelDescription,
	MatExpansionPanelHeader
} from "@angular/material/expansion";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";

@Component({
	selector: 'app-user-management',
	imports: [UserManagementDatatableComponent, MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatFormField, MatIcon, MatInput, MatLabel],
	templateUrl: './user-management.component.html',
	styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {

}
