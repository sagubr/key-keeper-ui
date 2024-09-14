/*Angular Core */
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

/**Angular Material */
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

/**Angular Material Modules */
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

/**Custom Components */
import { UserDto } from '@openapi/model/userDto';
import { UsersService } from '@openapi/api/users.service';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { UserFilterService } from '../users-filters/users-filters.service';
import { UsersDialogPasswordFormComponent } from '../users-dialog-password-form/users-dialog-password-form.component';

@Component({
  selector: 'app-users-datatable',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './users-datatable.component.html',
  styleUrl: './users-datatable.component.scss',
})
export class UsersDatatableComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  users: UserDto[] = [];
  dataSource = new MatTableDataSource<UserDto>(this.users);
  displayedColumns: string[] = [
    'name',
    'username',
    'email',
    'active',
    'created_at',
    'updated_at',
    'star',
  ];
  pageSizeOptions = [5, 10, 20, 50, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _subscription?: Subscription;

  constructor(
    public dialog: MatDialog,
    private readonly _filterService: UserFilterService,
    private readonly _userService: UsersService
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this._subscription = this._filterService.filter$.subscribe((filter) => {
      this.applyFilter(filter);
    });
    this.fetch();
  }

  ngOnDestroy() {
    this._subscription?.unsubscribe();
  }

  applyFilter(event: String) {
    this.dataSource.filter = event.trim().toLowerCase();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogPasswordFormComponent, {
      data: { name: 'this.name', animal: 'this.animal' },
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  fetch() {
    this._userService.getAllUsers().subscribe((res) => {
      this.dataSource.data = res;
    });
  }
}
