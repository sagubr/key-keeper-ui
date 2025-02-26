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
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped-table/table-wrapper-table";
import { finalize, Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { Permission } from "@openapi/model/permission";
import {
	PermissionFormDialogComponent
} from "@app/features/authorization/permission/permission-form-dialog/permission-form-dialog.component";
import { PermissionService } from "@openapi/api/permission.service";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";


@Component({
	selector: 'app-permission-datatable',
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
		MatFormField,
		MatInput,
		MatLabel,
		MatSuffix,
		MatToolbar,
		MatToolbarRow,
	],
	templateUrl: './permission-datatable.component.html',
	styleUrl: './permission-datatable.component.scss'
})
export class PermissionDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<Permission> = new MatTableDataSource<Permission>([]);
	columns: Columns<Permission>[] = [
		{
			definition: 'requester',
			header: 'Solicitantes',
			type: ColumnType.ARRAY,
			cell: (permission: Permission) => permission.requesters?.map((it) => it.name).filter(name => name)
		},
		{
			definition: 'location',
			header: 'Localização',
			type: ColumnType.ARRAY,
			cell: (permission: Permission) => permission.locations?.map((it) => it.name).filter(name => name)
		},
		{
			definition: 'description',
			header: 'Descrição',
			type: ColumnType.TEXT,
			cell: (permission: Permission) => permission.description
		},
	];
	displayedColumns: string[] = ['info', ...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private permissionService: PermissionService,
		private dialog: MatDialog,
	) {
	}

	ngOnInit(): void {
		this.findAll();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	onSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.dataSource.filter = value.trim().toLowerCase();
	}

	onReload(): void {
		this.findAll();
	}

	openCreateDialog(): void {
		const dialogRef = this.dialog.open(PermissionFormDialogComponent, {
			data: {},
		});

		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	openEditDialog(data: Permission) {
		const dialogRef = this.dialog.open(PermissionFormDialogComponent, {
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
		this.permissionService.findAllPermission()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (permissions) => {
				this.dataSource.data = permissions;
			}
		});
	}
}
