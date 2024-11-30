import { AfterViewInit, Component, input, InputSignal, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { finalize, Subscription } from "rxjs";
import { Key } from "@openapi/model/key";
import { Location } from "@openapi/model/location";
import { KeyService } from "@openapi/api/key.service";
import {
	LocationManagementDialogFormComponent
} from "@app/features/management/location-management/location-management-dialog-form/location-management-dialog-form.component";
import { MatDialog } from "@angular/material/dialog";
import {
	KeyManagementDialogFormComponent
} from "@app/features/management/key-management/key-management-dialog-form/key-management-dialog-form.component";
import { KeyManagementService } from "@app/features/management/key-management/key-management.service";

@Component({
	selector: 'app-key-management-datatable',
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
	templateUrl: './key-management-datatable.component.html',
	styleUrl: './key-management-datatable.component.scss'
})
export class KeyManagementDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	readonly location: InputSignal<Location> = input.required<Location>();

	dataSource: MatTableDataSource<Key> = new MatTableDataSource<Key>([]);
	columns: Columns<Key>[] = [
		{
			definition: 'description',
			header: 'Descrição',
			type: ColumnType.TEXT,
			cell: (element: Key) => element.description
		}
	];
	displayedColumns: string[] = [...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private keyService: KeyService,
		private keyManagementService: KeyManagementService,
		private dialog: MatDialog,
	) {
	}

	ngOnInit(): void {
		this.findAll(this.location());
		this.onSearch();
		this.onReload();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	openEditDialog(data: Location) {
		const dialogRef = this.dialog.open(KeyManagementDialogFormComponent, {
			data
		});
	}

	private findAll(location: Location): void {
		this.loading = true;
		this.keyService.findByLocation(location)
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (element) => {
				this.dataSource.data = element;
			}
		});
	}

	private onSearch(): void {
		this.subscriptions = this.keyManagementService.search$.subscribe(
			(event) => {
				this.dataSource.filter = event.trim().toLowerCase();
			});
	}

	private onReload(): void {
		this.subscriptions = this.keyManagementService.reload$.subscribe(() => {
			this.findAll(this.location());
		})
	}
}
