import { AfterViewInit, Component, OnDestroy, OnInit, output, ViewChild } from '@angular/core';
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
import { MatSort, MatSortModule } from "@angular/material/sort";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Facility } from "@openapi/model/facility";
import { finalize, Subscription } from "rxjs";
import { FacilityService } from "@openapi/api/facility.service";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDialog } from "@angular/material/dialog";
import {
	FacilityDialogFormComponent
} from "@app/features/resource/facility/facility-dialog-form/facility-dialog-form.component";
import { UserFormDialogComponent } from "@app/features/settings/user/user-form-dialog/user-form-dialog.component";
import { Location } from "@openapi/model/location";
import {
	LocationTypeFormDialog
} from "@app/features/resource/location-type/location-type-form-dialog/location-type-form-dialog";

@Component({
	selector: 'app-facility-datatable',
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
		MatSortModule,
		TableWrapperTable,
		MatMenuTrigger,
		MatHeaderCellDef,
		MatNoDataRow,
		MatPaginatorModule,
		MatFormFieldModule,
		MatInputModule,
		MatLabel,
		MatSuffix,
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
		const dialogRef = this.dialog.open(FacilityDialogFormComponent, {
			data: {},
		});
		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	openEditDialog(data: Location) {
		const dialogRef = this.dialog.open(FacilityDialogFormComponent, {
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
