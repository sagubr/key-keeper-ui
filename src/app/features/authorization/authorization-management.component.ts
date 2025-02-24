import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { CommonModule } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import {
	PermissionDatatableComponent
} from "@app/features/authorization/permission/permission-datatable/permission-datatable.component";
import {
	RequesterDatatableComponent
} from "@app/features/authorization/requester/requester-datatable/requester-datatable.component";

@Component({
	selector: 'app-authorization-management',
	imports: [
		CommonModule,
		MatTabsModule,
		MatIconModule,
		MatProgressBarModule,
		PermissionDatatableComponent,
		RequesterDatatableComponent,
	],
	templateUrl: './authorization-management.component.html',
	styleUrl: './authorization-management.component.scss'
})
export class AuthorizationManagementComponent {

}
