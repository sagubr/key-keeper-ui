import { Component, Inject } from '@angular/core';
import {
	KeyManagementDatatableComponent
} from "@app/features/resource-management/key-management/key-management-datatable/key-management-datatable.component";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Location } from "@openapi/model/location";
import {
	KeyManagementFiltersComponent
} from "@app/features/resource-management/key-management/key-management-filters/key-management-filters.component";

@Component({
    selector: 'app-key-management',
    imports: [
        KeyManagementDatatableComponent,
        KeyManagementFiltersComponent
    ],
    templateUrl: './key-management.component.html',
    styleUrl: './key-management.component.scss'
})
export class KeyManagementComponent {

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: Location,
	) {
	}

}
