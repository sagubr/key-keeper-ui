/* Angular Core */
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

/**Angular Material */
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort } from "@angular/material/sort";

/**Angular Material Modules */
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

/**Custom Components */
import { UsersService } from '@openapi/api/users.service';
import {
	UsersManagementDialogPasswordFormComponent
} from '@app/features/management/user-management/users-management-dialog-password-form/users-management-dialog-password-form.component';
import { User } from "@openapi/model/user";

import { Columns, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";

@Component({
	selector: 'app-users-management-datatable',
	standalone: true,
	imports: [
		CommonModule,
		MatTableModule,
		MatPaginatorModule,
		MatDialogModule,
		MatProgressBarModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatSort,
		TableWrapperTable,
	],
	templateUrl: './users-management-datatable.component.html',
	styleUrls: ['./users-management-datatable.component.scss'],
})
export class UsersManagementDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
	columns: Columns[] = [
		{ columnDef: 'name', header: 'Name', cell: (user: User) => user.name },
		{ columnDef: 'username', header: 'Username', cell: (user: User) => user.username },
		{ columnDef: 'email', header: 'Email', cell: (user: User) => user.email },
		{ columnDef: 'active', header: 'Active', cell: (user: User) => user.active ? 'Yes' : 'No' },
		{ columnDef: 'created_at', header: 'Created At', cell: (user: User) => user.createdAt },
		{ columnDef: 'updated_at', header: 'Updated At', cell: (user: User) => user.updatedAt },
	];
	displayedColumns: string[] = [...this.columns.map(c => c.columnDef), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private usersService: UsersService,
		private dialog: MatDialog,
	) {
	}

	ngOnInit(): void {
		this._initializeData();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	openPasswordDialog(user?: User): void {
		this.dialog.open(UsersManagementDialogPasswordFormComponent, {
			data: user,
		});
	}

	private _initializeData(): void {
		this.loading = true;
		this.usersService.getAllUsers().pipe(finalize(() => this.loading = false))
			.subscribe({
				next: (users) => {
					this.dataSource.data = users;
				},
				error: (err) => {
					console.error('Error fetching user data:', err);
				}
			});
	}

}
