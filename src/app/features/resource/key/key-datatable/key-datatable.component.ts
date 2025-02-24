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
import { MatDialog } from "@angular/material/dialog";
import { KeyFormDialogComponent } from "@app/features/resource/key/key-form-dialog/key-form-dialog.component";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";

@Component({
    selector: 'app-key-datatable',
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
		MatPaginator,
		MatFormField,
		MatInput,
		MatLabel,
		MatSuffix,
		MatToolbar,
		MatToolbarRow
	],
    templateUrl: './key-datatable.component.html',
    styleUrl: './key-datatable.component.scss'
})
export class KeyDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

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
		private dialog: MatDialog,
	) {
	}

	ngOnInit(): void {
		this.findAll(this.location());
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
		//this.findAll();
	}

	openCreateDialog(): void {
		const dialogRef = this.dialog.open(KeyFormDialogComponent, {
			data: {},
		});

		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	openEditDialog(data: Location) {
		const dialogRef = this.dialog.open(KeyFormDialogComponent, {
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
}
