import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
	MatCell,
	MatCellDef,
	MatColumnDef,
	MatHeaderCell, MatHeaderCellDef,
	MatHeaderRow,
	MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTableDataSource
} from "@angular/material/table";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { Columns, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { User } from "@openapi/model/user";
import { Location } from "@openapi/model/location";
import { finalize, Subscription } from "rxjs";
import { LocationService } from "@openapi/api/location.service";

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
	columns: Columns[] = [
		{ columnDef: 'name', header: 'Name', type: 'text', cell: (location: Location) => location.name },
		{
			columnDef: 'facility',
			header: 'Instalação',
			type: 'text',
			cell: (location: Location) => location.facility.name
		},
		{
			columnDef: 'locationType',
			header: 'Tipo de Local',
			type: 'text',
			cell: (location: Location) => location.locationType.name
		},
		{
			columnDef: 'active',
			header: 'Ativo',
			type: 'text',
			cell: (location: Location) => location.active ? 'Yes' : 'No'
		},
	];
	displayedColumns: string[] = [...this.columns.map(c => c.columnDef), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(private readonly locationService: LocationService) {
	}

	ngOnInit(): void {
		this._initializeData();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	private _initializeData(): void {
		this.loading = true;
		this.locationService.findAll().pipe(finalize(() => this.loading = false))
			.subscribe({
				next: (location) => {
					this.dataSource.data = location;
				},
				error: (err) => {
					console.error('Error fetching user data:', err);
				}
			});
	}
}
