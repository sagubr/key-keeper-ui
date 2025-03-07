import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Columns, ColumnType, TableWrapper } from "@app/shared/components/table-wrapped/table-wrapper";
import { Location } from "@openapi/model/location";
import { finalize, Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { LocationTypeService } from "@openapi/api/locationType.service";
import {
	LocationTypeFormDialog
} from "@app/features/resource/location-type/location-type-form-dialog/location-type-form-dialog";
import { LocationTypeDto } from "@openapi/model/locationTypeDto";
import { LocationType } from "@openapi/model/locationType";

@Component({
	selector: 'app-location-type-datatable',
	imports: [
		MatTableModule,
		MatIconModule,
		MatMenuModule,
		MatButtonModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatSortModule,
		TableWrapper,
		MatFormFieldModule,
		MatInputModule,
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
			header: 'Tipo de Ambiente',
			type: ColumnType.TEXT,
			cell: (element: LocationType) => element.name,
		},
		{
			definition: 'description',
			header: 'Descrição',
			type: ColumnType.TEXT,
			cell: (element: LocationType) => element.description,
		}
	];
	displayedColumns: string[] = [...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private readonly locationTypeService: LocationTypeService,
		private readonly dialog: MatDialog,
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
		this.dialog.open(LocationTypeFormDialog, {
			data: {},
		}).afterClosed().subscribe(() => this.onReload());
	}

	openEditDialog(data: Location) {
		this.dialog.open(LocationTypeFormDialog, {
			data
		}).afterClosed().subscribe(() => this.findAll());
	}

	private findAll(): void {
		this.loading = true;
		this.locationTypeService.findAllLocationType()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (locationType) => {
				this.dataSource.data = locationType;
			}
		});
	}
}
