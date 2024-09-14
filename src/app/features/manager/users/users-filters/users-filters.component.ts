/*Angular Core*/
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/*Angular Material*/
import { MatDialog } from '@angular/material/dialog';

/*Angular Material Modules*/
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

/*Custom Components*/
import { UsersDialogFormComponent } from '../users-dialog-form/users-dialog-form.component';
import { UserFilterService } from './users-filters.service';

@Component({
  selector: 'app-users-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
  ],
  templateUrl: './users-filters.component.html',
  styleUrl: './users-filters.component.scss',
})
export class UsersFiltersComponent {
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  animal: string = '';
  name: string = '';

  constructor(
    public dialog: MatDialog,
    private filterService: UserFilterService
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogFormComponent, {
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.animal = result;
    });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterService.setFilter(value);
  }
}

export interface Food {
  value: string;
  viewValue: string;
}
