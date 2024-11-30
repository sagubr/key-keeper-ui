/* Angular Core */
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

/**Angular Material */
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from "@angular/material/sort";

/**Angular Material Modules */
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

/**Custom Components */
import { UsersService } from '@openapi/api/users.service';
import {
	UserManagementDialogPasswordFormComponent
} from '@app/features/management/user-management/user-management-dialog-password-form/user-management-dialog-password-form.component';
import { User } from "@openapi/model/user";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { UserDto } from "@openapi/model/userDto";
import {
	UserManagementDialogFormComponent
} from "@app/features/management/user-management/user-management-dialog-form/user-management-dialog-form.component";
import { UserManagementService } from "@app/features/management/user-management/user-management.service";

@Component({
    selector: 'app-user-management-datatable',
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
    templateUrl: './user-management-datatable.component.html',
    styleUrls: ['./user-management-datatable.component.scss']
})
export class UserManagementDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
	columns: Columns<User>[] = [
		{
			definition: 'name',
			header: 'Name',
			type: ColumnType.TEXT,
			cell: (user: User) => user.name
		},
		{
			definition: 'username',
			header: 'Username',
			type: ColumnType.TEXT,
			cell: (user: User) => user.username
		},
		{
			definition: 'email',
			header: 'Email',
			type: ColumnType.TEXT,
			cell: (user: User) => user.email
		},
		{
			definition: 'updated_at',
			header: 'Atualizado em',
			type: ColumnType.DATE,
			cell: (user: User) => user.updatedAt
		},
	];
	displayedColumns: string[] = ['info', ...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private usersService: UsersService,
		private usersManagementService: UserManagementService,
		private dialog: MatDialog,
	) {
	}

	ngOnInit(): void {
		this.findAll();
		this.onSearch();
		this.onReload();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	openPasswordDialog(user?: User): void {
		this.dialog.open(UserManagementDialogPasswordFormComponent, {
			data: user,
		});
	}

	openEditDialog(data: UserDto) {
		const dialogRef = this.dialog.open(UserManagementDialogFormComponent, {
			data
		});

		dialogRef.afterClosed().subscribe({
			next: (val) => {
				if (val) {
					this.findAll();
				}
			}
		});
	}

	private findAll(): void {
		this.loading = true;
		this.usersService.findAllUsers()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (users) => {
				this.dataSource.data = users;
			},
			error: (err) => {
				console.error('Error fetching user data:', err);
			}
		});
	}

	private onSearch(): void {
		this.subscriptions = this.usersManagementService.search$.subscribe(
			(event) => {
				this.dataSource.filter = event.trim().toLowerCase();
			});
	}

	private onReload(): void {
		this.subscriptions = this.usersManagementService.reload$.subscribe(() => {
			this.findAll();
		})
	}

}
