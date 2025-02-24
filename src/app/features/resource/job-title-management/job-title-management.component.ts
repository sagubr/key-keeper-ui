import { Component } from '@angular/core';
import {
	JobTitleManagementDatatableComponent
} from "@app/features/resource/job-title-management/job-title-management-datatable/job-title-management-datatable.component";
import {
	JobTitleManagementFiltersComponent
} from "@app/features/resource/job-title-management/job-title-management-filters/job-title-management-filters.component";

@Component({
    selector: 'app-job-title-management',
    imports: [
        JobTitleManagementDatatableComponent,
        JobTitleManagementFiltersComponent
    ],
    templateUrl: './job-title-management.component.html',
    styleUrl: './job-title-management.component.scss'
})
export class JobTitleManagementComponent {

}
