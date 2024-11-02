/*Angular Core */
import {
	AfterViewInit,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

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
import { UsersService } from '@openapi/api/users.service';
import {
	UserFilterService
} from '@app/features/management/user-management/users-management-filters/users-filters.service';
import {
	UsersManagementDialogPasswordFormComponent
} from '@app/features/management/user-management/users-management-dialog-password-form/users-management-dialog-password-form.component';
import { UserCommunicationService } from "@app/features/management/user-management/user-communication.service";
import { User } from "@openapi/model/user";
import { MatSort } from "@angular/material/sort";
import { Columns, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";

@Component({
	selector: 'app-users-management-datatable',
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
		MatSort,
		TableWrapperTable,
	],
	templateUrl: './users-management-datatable.component.html',
	styleUrl: './users-management-datatable.component.scss',
})
export class UsersManagementDatatableComponent
	implements AfterViewInit, OnInit, OnDestroy {

	dataSource: MatTableDataSource<User, MatPaginator> = new MatTableDataSource<User>([]);

	columns: Columns[] = [
		{ columnDef: 'name', header: 'Name', cell: (element: any) => `${ element.name }` },
		{ columnDef: 'username', header: 'Username', cell: (element: any) => `${ element.username }` },
		{ columnDef: 'email', header: 'Email', cell: (element: any) => `${ element.email }` },
		{ columnDef: 'active', header: 'Active', cell: (element: any) => `${ element.active ? 'Sim' : 'Não' }` },
		{ columnDef: 'created_at', header: 'Created At', cell: (element: any) => `${ element.created_at }` },
		{ columnDef: 'updated_at', header: 'Updated At', cell: (element: any) => `${ element.updated_at }` },
	];

	displayedColumns: string[] = [...this.columns.map(c => c.columnDef), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild('sort') sort!: MatSort;

	private _subscription?: Subscription;

	constructor(
		public dialog: MatDialog,
		private readonly _filterService: UserFilterService,
		private readonly _userCommunicationService: UserCommunicationService,
		private readonly _userService: UsersService,
	) {
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort
	}

	ngOnInit() {
		this._subscription?.add(
			this._filterService.filter$.subscribe((filter) => {
				this.applyFilter(filter);
			})
		);

		this._subscription?.add(
			this._userCommunicationService.userSaved$.subscribe(() => {
				this.fetch();
			})
		)
		this.fetch();
	}

	ngOnDestroy() {
		this._subscription?.unsubscribe();
	}

	applyFilter(event: String) {
		this.dataSource.filter = event.trim().toLowerCase();
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(UsersManagementDialogPasswordFormComponent, {
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
