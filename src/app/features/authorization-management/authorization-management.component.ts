import { Component } from '@angular/core';
import {
    JobTitleManagementComponent
} from "@app/features/resource-management/job-title-management/job-title-management.component";
import {
    LocationManagementComponent
} from "@app/features/resource-management/location-management/location-management.component";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatTab, MatTabGroup, MatTabLabel, MatTabsModule } from "@angular/material/tabs";
import { UserManagementComponent } from "@app/features/resource-management/user-management/user-management.component";
import { CommonModule } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterLink } from "@angular/router";
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
		RouterLink,
		UserManagementComponent,
		LocationManagementComponent,
		JobTitleManagementComponent,
		PermissionManagementComponent,
		RequesterManagementComponent,
	],
  templateUrl: './authorization-management.component.html',
  styleUrl: './authorization-management.component.scss'
})
export class AuthorizationManagementComponent {

}
