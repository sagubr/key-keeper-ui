/*Angular Core */
import { Component } from '@angular/core';

/**Custom Components */
import { UsersDatatableComponent } from './users-datatable/users-datatable.component';
import { UsersFiltersComponent } from "./users-filters/users-filters.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [UsersDatatableComponent, UsersFiltersComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {}
