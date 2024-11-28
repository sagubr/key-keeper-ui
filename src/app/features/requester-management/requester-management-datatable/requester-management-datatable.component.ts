import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { User } from "@openapi/model/user";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { finalize, Subscription } from "rxjs";
import { UsersService } from "@openapi/api/users.service";
import { UserManagementService } from "@app/features/management/user-management/user-management.service";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import {
	UserManagementDialogPasswordFormComponent
} from "@app/features/management/user-management/user-management-dialog-password-form/user-management-dialog-password-form.component";
import { UserDto } from "@openapi/model/userDto";
import {
	UserManagementDialogFormComponent
} from "@app/features/management/user-management/user-management-dialog-form/user-management-dialog-form.component";
import { CommonModule } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RequestersService } from "@openapi/api/requesters.service";
import { Requester } from "@openapi/model/requester";
import { request } from "express";

@Component({
  selector: 'app-requester-management-datatable',
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
  templateUrl: './requester-management-datatable.component.html',
  styleUrl: './requester-management-datatable.component.scss'
})
export class RequesterManagementDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<Requester> = new MatTableDataSource<Requester>([]);
	columns: Columns<Requester>[] = [
		{
			definition: 'name',
			header: 'Name',
			type: ColumnType.TEXT,
			cell: (requester: Requester) => requester.name
		},
		{
			definition: 'email',
			header: 'Email',
			type: ColumnType.TEXT,
			cell: (requester: Requester) => requester.email
		},
		{
			definition: 'updated_at',
			header: 'Atualizado em',
			type: ColumnType.DATE,
			cell: (requester: Requester) => requester.updatedAt
		},
	];
	displayedColumns: string[] = ['info', ...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private requesterService: RequestersService,
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
		this.requesterService.findAllRequesters()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (requester) => {
				this.dataSource.data = requester;
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
