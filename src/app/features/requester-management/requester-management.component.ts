import { Component } from '@angular/core';
import {
	RequesterManagementDatatableComponent
} from "@app/features/requester-management/requester-management-datatable/requester-management-datatable.component";

@Component({
  selector: 'app-requester',
  standalone: true,
	imports: [
		RequesterManagementDatatableComponent
	],
  templateUrl: './requester-management.component.html',
  styleUrl: './requester-management.component.scss'
})
export class RequesterManagementComponent {

}