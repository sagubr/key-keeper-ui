import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { Columns, ColumnType, TableWrapper } from "@app/shared/components/table-wrapped/table-wrapper";
import { Location } from "@openapi/model/location";
import { finalize, Subscription } from "rxjs";
import { LocationService } from "@openapi/api/location.service";
import { MatDialog } from "@angular/material/dialog";

import {
	LocationFormDialogComponent
} from "@app/features/resource/location/location-form-dialog/location-form-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { KeyComponent } from "@app/features/resource/key/key.component";
import { LocationDto } from "@openapi/model/locationDto";

@Component({
	selector: 'app-location-datatable',
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
	templateUrl: './location-datatable.component.html',
	styleUrl: './location-datatable.component.scss'
})
export class LocationDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<Location> = new MatTableDataSource<Location>([]);
	columns: Columns<Location>[] = [
		{
			definition: 'name',
			header: 'Nome da Sala',
			type: ColumnType.TEXT,
			cell: (element: Location) => element.name,
			hasDescription: true,
			description: (element: Location) => element.description,
		},
		{
			definition: 'facility',
			header: 'Instalação',
			type: ColumnType.TEXT,
			cell: (element: Location) => element.facility?.name || 'N/A',
			hasDescription: true,
			description: (element: Location) => element.facility?.description || 'Sem descrição',
		},
		{
			definition: 'locationType',
			header: 'Tipo de Local',
			type: ColumnType.TEXT,
			cell: (element: Location) => element.locationType?.name || 'N/A',
			hasDescription: true,
			description: (element: Location) => element.locationType?.description || 'Sem descrição',
		},
		{
			definition: 'restricted',
			header: 'Restrito',
			type: ColumnType.BOOLEAN,
			cell: (element: Location) => element.restricted
		},
		{
			definition: 'publicAccess',
			header: 'Público',
			type: ColumnType.BOOLEAN,
			cell: (element: Location) => element.publicAccess
		},
	];
	displayedColumns: string[] = [...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private readonly locationService: LocationService,
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
		this.dialog.open(LocationFormDialogComponent, {
			data: {},
		}).afterClosed().subscribe(() => this.onReload());
	}

	openEditDialog(data: Location) {
		this.dialog.open(LocationFormDialogComponent, {
			data
		}).afterClosed().subscribe(() => this.findAll());
	}

	openKeyDialog(data: Location) {
		this.dialog.open(KeyComponent, {
			data,
			minWidth: '700px'
		});
	}

	private findAll(): void {
		this.loading = true;
		this.locationService.findAllLocation()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (locations) => {
				this.dataSource.data = locations;
			}
		});
	}
}
