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
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { Location } from "@openapi/model/location";
import { finalize, Subscription } from "rxjs";
import { LocationService } from "@openapi/api/location.service";
import { UsersService } from "@openapi/api/users.service";
import { UsersManagementService } from "@app/features/management/user-management/users-management.service";
import { MatDialog } from "@angular/material/dialog";
import { User } from "@openapi/model/user";
import {
	UsersManagementDialogPasswordFormComponent
} from "@app/features/management/user-management/users-management-dialog-password-form/users-management-dialog-password-form.component";
import { UserDto } from "@openapi/model/userDto";
import {
	UsersManagementDialogFormComponent
} from "@app/features/management/user-management/users-management-dialog-form/users-management-dialog-form.component";

@Component({
	selector: 'app-location-datatable',
	standalone: true,
	imports: [
		MatCell,
		MatCellDef,
		MatColumnDef,
		MatHeaderCell,
		MatHeaderRow,
		MatHeaderRowDef,
		MatIcon,
		MatIconButton,
		MatMenu,
		MatMenuItem,
		MatPaginator,
		MatProgressBar,
		MatRow,
		MatRowDef,
		MatSort,
		TableWrapperTable,
		MatMenuTrigger,
		MatHeaderCellDef,
		MatNoDataRow
	],
	templateUrl: './location-management-datatable.component.html',
	styleUrl: './location-management-datatable.component.scss'
})
export class LocationManagementDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<Location> = new MatTableDataSource<Location>([]);
	columns: Columns<Location>[] = [
		{
			definition: 'name',
			header: 'Name',
			type: ColumnType.TEXT,
			cell: (location: Location) => location.name
		},
		{
			definition: 'facility',
			header: 'Instalação',
			type: ColumnType.TEXT,
			cell: (location: Location) => location.facility.name
		},
		{
			definition: 'locationType',
			header: 'Tipo de Local',
			type: ColumnType.TEXT,
			cell: (location: Location) => location.locationType.name
		},
		{
			definition: 'active',
			header: 'Ativo',
			type: ColumnType.TEXT,
			cell: (location: Location) => location.active ? 'Yes' : 'No'
		},
		{
			definition: 'create_at',
			header: 'Criado em',
			type: ColumnType.DATE,
			cell: (location: Location) => location.createdAt
		},
	];
	displayedColumns: string[] = ['info', ...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private locationService: LocationService,
		//private usersManagementService: UsersManagementService,
		private dialog: MatDialog,
	) {
	}

	ngOnInit(): void {
		this.findAll();
		// this.onSearch();
		// this.onReload();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	openEditDialog(data: UserDto) {
		const dialogRef = this.dialog.open(UsersManagementDialogFormComponent, {
			data,
			width: '540px'
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
		this.locationService.findAllLocations()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (locations) => {
				this.dataSource.data = locations;
			}
		});
	}

	// private onSearch(): void {
	// 	this.subscriptions = this.usersManagementService.search$.subscribe(
	// 		(event) => {
	// 			this.dataSource.filter = event.trim().toLowerCase();
	// 		});
	// }
	//
	// private onReload(): void {
	// 	this.subscriptions = this.usersManagementService.reload$.subscribe(() => {
	// 		this.findAll();
	// 	})
	// }
}
