import { Component } from '@angular/core';
import {
	JobTitleManagementDatatableComponent
} from "@app/features/management/job-title-management/job-title-management-datatable/job-title-management-datatable.component";

@Component({
  selector: 'app-job-title-management',
  standalone: true,
	imports: [
		JobTitleManagementDatatableComponent
	],
  templateUrl: './job-title-management.component.html',
  styleUrl: './job-title-management.component.scss'
})
export class JobTitleManagementComponent {

}
