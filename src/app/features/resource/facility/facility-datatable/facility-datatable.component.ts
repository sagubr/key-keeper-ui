import { AfterViewInit, Component, OnDestroy, OnInit, output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { Columns, ColumnType, TableWrapper } from "@app/shared/components/table-wrapped/table-wrapper";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Facility } from "@openapi/model/facility";
import { finalize, Subscription } from "rxjs";
import { FacilityService } from "@openapi/api/facility.service";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDialog } from "@angular/material/dialog";
import {
	FacilityDialogFormComponent
} from "@app/features/resource/facility/facility-dialog-form/facility-dialog-form.component";
import { Location } from "@openapi/model/location";

@Component({
	selector: 'app-facility-datatable',
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
	templateUrl: './facility-datatable.component.html',
	styleUrl: './facility-datatable.component.scss'
})
export class FacilityDatatableComponent implements OnInit, OnDestroy, AfterViewInit {

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
			definition: 'description',
			header: 'Descrição',
			type: ColumnType.TEXT,
			cell: (facility: Facility) => facility.description
		},
	];
	displayedColumns: string[] = [...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	row = output<Facility>()

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(private facilityService: FacilityService,
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
		this.dialog.open(FacilityDialogFormComponent, {
			data: {},
		}).afterClosed().subscribe(() => this.onReload());
	}

	openEditDialog(data: Location) {
		this.dialog.open(FacilityDialogFormComponent, {
			data
		}).afterClosed().subscribe(() => this.findAll());
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
