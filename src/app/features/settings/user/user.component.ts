import { Component } from '@angular/core';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { UserDatatableComponent } from "@app/features/settings/user/user-datatable/user-datatable.component";

@Component({
	selector: 'app-user',
	imports: [MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, UserDatatableComponent],
	templateUrl: './user.component.html',
	styleUrl: './user.component.scss'
})
export class UserComponent {

}
