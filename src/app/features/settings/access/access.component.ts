import { Component } from '@angular/core';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { UserDatatableComponent } from "@app/features/settings/access/user-datatable/user-datatable.component";
import {
	AssignmentDatatableComponent
} from "@app/features/settings/access/assignment-datatable/assignment-datatable.component";

@Component({
	selector: 'app-access',
	imports: [MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, UserDatatableComponent, AssignmentDatatableComponent],
	templateUrl: './access.component.html',
	styleUrl: './access.component.scss'
})
export class AccessComponent {

}
