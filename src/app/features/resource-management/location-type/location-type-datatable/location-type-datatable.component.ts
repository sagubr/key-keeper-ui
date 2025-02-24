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
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { Location } from "@openapi/model/location";
import { finalize, Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { LocationType } from "@openapi/model/locationType";
import { LocationTypeService } from "@openapi/api/locationType.service";
import {
	LocationTypeFormDialog
} from "@app/features/resource-management/location-type/location-type-form-dialog/location-type-form-dialog";

@Component({
	selector: 'app-location-type-datatable',
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
		MatPaginatorModule,
		MatProgressBarModule,
		MatRow,
		MatRowDef,
		MatSortModule,
		TableWrapperTable,
		MatMenuTrigger,
		MatHeaderCellDef,
		MatNoDataRow,
		MatFormFieldModule,
		MatInputModule,
		MatLabel,
		MatSuffix,
		MatToolbarModule,
	],
	templateUrl: './location-type-datatable.component.html',
	styleUrl: './location-type-datatable.component.scss'
})
export class LocationTypeDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<LocationType> = new MatTableDataSource<LocationType>([]);
	columns: Columns<LocationType>[] = [
		{
			definition: 'name',
			header: 'Name',
			type: ColumnType.TEXT,
			cell: (location: LocationType) => location.name
		}
	];
	displayedColumns: string[] = [...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private locationTypeService: LocationTypeService,
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
		const dialogRef = this.dialog.open(LocationTypeFormDialog, {
			data: {},
		});

		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	openEditDialog(data: Location) {
		const dialogRef = this.dialog.open(LocationTypeFormDialog, {
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
		this.locationTypeService.findAllLocationTypes()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (locations) => {
				this.dataSource.data = locations;
			}
		});
	}
}
