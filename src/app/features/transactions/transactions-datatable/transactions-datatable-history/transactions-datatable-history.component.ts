import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Reservation } from "@openapi/model/reservation";
import { Columns, ColumnType, TableWrapper } from "@app/shared/components/table-wrapped/table-wrapper";
import { finalize, Subscription } from "rxjs";
import { ReservationService } from "@openapi/api/reservation.service";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Status } from "@openapi/model/status";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import {
	TransactionsFormDialogComponent
} from "@app/features/transactions/transactions-form-dialog/transactions-form-dialog.component";
import { UpperCasePipe } from "@angular/common";

@Component({
	selector: 'app-transactions-datatable-history',
	imports: [
		MatTableModule,
		MatIconModule,
		MatButtonModule,
		MatMenuModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatSortModule,
		TableWrapper,
		MatFormFieldModule,
		MatInputModule,
		MatToolbarModule,
		UpperCasePipe,
	],
	templateUrl: './transactions-datatable-history.component.html',
	styleUrl: './transactions-datatable-history.component.scss'
})
export class TransactionsDatatableHistoryComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	protected readonly Status = Status;

	dataSource: MatTableDataSource<Reservation> = new MatTableDataSource<Reservation>([]);
	columns: Columns<Reservation>[] = [
		{
			definition: 'requester',
			header: 'Solicitante',
			type: ColumnType.TEXT,
			cell: (reservation: Reservation) => reservation.requester?.name
		},
		{
			definition: 'name',
			header: 'Localização',
			type: ColumnType.TEXT,
			cell: (reservation: Reservation) => reservation.location?.name
		},
		{
			definition: 'formatted_period',
			header: 'Período',
			type: ColumnType.TEXT,
			cell: (reservation: Reservation) => reservation.formattedPeriod
		}
	];
	displayedColumns: string[] = ['info', ...this.columns.map(c => c.definition), 'menu'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private readonly reservationService: ReservationService,
		private dialog: MatDialog
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
		this.dialog.open(TransactionsFormDialogComponent, {
			minWidth: '540px',
			data: {},
		}).afterClosed().subscribe(() => this.onReload());
	}

	openEditDialog(data: Reservation) {
		// const dialogRef = this.dialog.open(, {
		// 	data,
		// 	width: '540px'
		// });
		//
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
		this.reservationService
			.findByActiveTrueAndStatusIn([Status.Concluido, Status.Cancelado])
			.pipe(finalize(
				() => this.loading = false
			))
			.subscribe({
				next: (reservation) => {
					this.dataSource.data = reservation;
				}
			});
	}

}
