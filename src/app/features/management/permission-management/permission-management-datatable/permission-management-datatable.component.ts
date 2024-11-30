import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
	MatCell,
	MatCellDef,
	MatColumnDef,
	MatHeaderCell,
	MatHeaderCellDef,
	MatHeaderRow,
	MatHeaderRowDef,
	MatNoDataRow,
	MatRow,
	MatRowDef,
	MatTableDataSource
} from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { finalize, Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { Permission } from "@openapi/model/permission";
import {
	PermissionManagementService
} from "@app/features/management/permission-management/permission-management.service";
import {
	PermissionManagementDialogFormComponent
} from "@app/features/management/permission-management/permission-management-dialog-form/permission-management-dialog-form.component";
import { PermissionService } from "@openapi/api/permission.service";


@Component({
	selector: 'app-permission-management-datatable',
	standalone: true,
	imports: [
		MatCell,
		MatCellDef,
		MatColumnDef,
		MatHeaderCell,
		MatHeaderRow,
		MatHeaderRowDef,
		MatIconModule,
		MatMenuModule,
		MatButtonModule,
		MatPaginator,
		MatProgressBarModule,
		MatRow,
		MatRowDef,
		MatSort,
		TableWrapperTable,
		MatMenuTrigger,
		MatHeaderCellDef,
		MatNoDataRow,
	],
	templateUrl: './permission-management-datatable.component.html',
	styleUrl: './permission-management-datatable.component.scss'
})
export class PermissionManagementDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<Permission> = new MatTableDataSource<Permission>([]);
	columns: Columns<Permission>[] = [
		{
			definition: 'description',
			header: 'Descrição',
			type: ColumnType.TEXT,
			cell: (permission: Permission) => permission.description
		},
		{
			definition: 'location',
			header: 'Localização',
			type: ColumnType.TEXT,
			cell: (permission: Permission) => permission.location.name
		},
		{
			definition: 'startDateTime',
			header: 'Início da validade',
			type: ColumnType.DATE,
			cell: (permission: Permission) => permission.startDateTime
		},
		{
			definition: 'endDateTime',
			header: 'Fim da validade',
			type: ColumnType.DATE,
			cell: (permission: Permission) => permission.endDateTime
		},
		{
			definition: 'requester',
			header: 'Solicitante',
			type: ColumnType.TEXT,
			cell: (permission: Permission) => permission.requester.name
		},
	];
	displayedColumns: string[] = ['info', ...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private permissionService: PermissionService,
		private permissionManagementService: PermissionManagementService,
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

	openEditDialog(data: Permission) {
		const dialogRef = this.dialog.open(PermissionManagementDialogFormComponent, {
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
		this.permissionService.findAllPermissions()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (permissions) => {
				this.dataSource.data = permissions;
			}
		});
	}

	private onSearch(): void {
		this.subscriptions = this.permissionManagementService.search$.subscribe(
			(event) => {
				this.dataSource.filter = event.trim().toLowerCase();
			});
	}

	private onReload(): void {
		this.subscriptions = this.permissionManagementService.reload$.subscribe(() => {
			this.findAll();
		})
	}
}
