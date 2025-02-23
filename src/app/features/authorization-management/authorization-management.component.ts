import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { CommonModule } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import {
	PermissionManagementComponent
} from "@app/features/authorization-management/permission-management/permission-management.component";
import {
	RequesterManagementComponent
} from "@app/features/authorization-management/requester-management/requester-management.component";

@Component({
  selector: 'app-authorization-management',
	imports: [
		CommonModule,
		MatTabsModule,
		MatIconModule,
		MatProgressBarModule,
		PermissionManagementComponent,
		RequesterManagementComponent,
	],
  templateUrl: './authorization-management.component.html',
  styleUrl: './authorization-management.component.scss'
})
export class AuthorizationManagementComponent {

}
