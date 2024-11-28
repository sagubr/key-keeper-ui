import { AfterViewInit, Component, EventEmitter, OnInit, output, Output, ViewChild } from '@angular/core';
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
import { MatSort } from "@angular/material/sort";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Facility } from "@openapi/model/facility";
import { finalize, Subscription } from "rxjs";
import { FacilityService } from "@openapi/api/facility.service";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginator } from "@angular/material/paginator";

@Component({
	selector: 'app-facility-management-datatable',
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
		MatProgressBarModule,
		MatButtonModule,
		MatRow,
		MatRowDef,
		MatSort,
		TableWrapperTable,
		MatMenuTrigger,
		MatHeaderCellDef,
		MatNoDataRow,
		MatPaginator
	],
	templateUrl: './facility-management-datatable.component.html',
	styleUrl: './facility-management-datatable.component.scss'
})
export class FacilityManagementDatatableComponent implements OnInit, AfterViewInit {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<Facility> = new MatTableDataSource<Facility>([]);
	columns: Columns<Facility>[] = [
		{
			definition: 'name',
			header: 'Name',
			type: ColumnType.TEXT,
			cell: (facility: Facility) => facility.name
		},
		{
			definition: 'active',
			header: 'Ativo',
			type: ColumnType.TEXT,
			cell: (facility: Facility) => facility.active ? 'Yes' : 'No'
		},
		{
			definition: 'create_at',
			header: 'Criado em',
			type: ColumnType.DATE,
			cell: (facility: Facility) => facility.createdAt
		},
	];
	displayedColumns: string[] = [...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	row = output<Facility>()

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(private facilityService: FacilityService) {
	}

	ngOnInit(): void {
		this.findAll();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	rowClick(row: Facility) {
		this.row.emit(row);
	}

	private findAll(): void {
		this.loading = true;
		this.facilityService.findAllFacilities()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (facilities) => {
				this.dataSource.data = facilities;
			}
		});
	}
}
