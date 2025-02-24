import { AfterViewInit, Component, input, InputSignal, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Reservation } from "@openapi/model/reservation";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
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

@Component({
	selector: 'app-transactions-datatable-progress',
	imports: [
		MatTableModule,
		MatIconModule,
		MatButtonModule,
		MatMenuModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatSortModule,
		TableWrapperTable,
		MatFormFieldModule,
		MatInputModule,
		MatToolbarModule,
	],
	templateUrl: './transactions-datatable-progress.component.html',
	styleUrl: './transactions-datatable-progress.component.scss'
})
export class TransactionsDatatableProgressComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	readonly status: InputSignal<Status> = input.required<Status>();
	protected readonly Status = Status;

	dataSource: MatTableDataSource<Reservation> = new MatTableDataSource<Reservation>([]);
	columns: Columns<Reservation>[] = [
		{
			definition: 'requester',
			header: 'Solicitante',
			type: ColumnType.TEXT,
			cell: (reservation: Reservation) => reservation.permission?.requester.name
		},
		{
			definition: 'name',
			header: 'Localização',
			type: ColumnType.TEXT,
			cell: (reservation: Reservation) => reservation.permission?.location.name
		},
		{
			definition: 'start_date_time',
			header: 'Início',
			type: ColumnType.DATETIME,
			cell: (reservation: Reservation) => reservation.startDateTime
		},
		{
			definition: 'end_date_time',
			header: 'Fim',
			type: ColumnType.DATETIME,
			cell: (reservation: Reservation) => reservation.endDateTime
		},
	];
	displayedColumns: string[] = [...this.columns.map(c => c.definition), 'action', 'menu'];
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
		const dialogRef = this.dialog.open(TransactionsFormDialogComponent, {
			minWidth: '540px',
			data: {},
		});

		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	changeStatus(element: Reservation): void {
		this.reservationService.changeStatusReservation(element).subscribe({
			next: (response) => console.log('Requisição bem-sucedida:', response),
			error: (err) => console.error('Erro na requisição:', err),
		});
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
			.findAllByStatusReservation(this.status())
			.pipe(finalize(
				() => this.loading = false
			))
			.subscribe({
				next: (reservation) => {
					console.log(1)
					this.dataSource.data = reservation;
				}
			});
	}

}
