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
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { Location } from "@openapi/model/location";
import { finalize, Subscription } from "rxjs";
import { LocationService } from "@openapi/api/location.service";
import { MatDialog } from "@angular/material/dialog";

import {
	LocationManagementDialogFormComponent
} from "@app/features/resource-management/location-management/location-management-dialog-form/location-management-dialog-form.component";
import { MatButtonModule } from "@angular/material/button";
import { KeyManagementComponent } from "@app/features/resource-management/key-management/key-management.component";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";

@Component({
    selector: 'app-location-datatable',
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
		MatToolbarRow
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
			definition: 'update_at',
			header: 'Atualizado em',
			type: ColumnType.DATE,
			cell: (location: Location) => location.createdAt
		},
	];
	displayedColumns: string[] = [...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private locationService: LocationService,
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
		const dialogRef = this.dialog.open(LocationManagementDialogFormComponent, {
			data: {},
		});

		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	openEditDialog(data: Location) {
		const dialogRef = this.dialog.open(LocationManagementDialogFormComponent, {
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

	openKeyDialog(data: Location) {
		const dialogRef = this.dialog.open(KeyManagementComponent, {
			data
		});

		// dialogRef.afterClosed().subscribe({
		// 	next: (val) => {
		// 		if (val) {
		// 			this.findAll();
		// 		}
		// 	}
		// });
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
}
