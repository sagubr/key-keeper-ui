import { AfterViewInit, Component, input, InputSignal, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import {
	MatCell,
	MatCellDef,
	MatColumnDef,
	MatHeaderCell, MatHeaderCellDef,
	MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef,
	MatTableDataSource
} from "@angular/material/table";
import { Reservation } from "@openapi/model/reservation";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { finalize, Subscription } from "rxjs";
import { ReservationService } from "@openapi/api/reservation.service";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatProgressBar } from "@angular/material/progress-bar";
import { Status } from "@openapi/model/status";

@Component({
	selector: 'app-transactions-management-datatable',
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
		MatSortHeader,
		TableWrapperTable,
		MatHeaderCellDef,
		MatMenuTrigger,
		MatNoDataRow
	],
	templateUrl: './transactions-management-datatable.component.html',
	styleUrl: './transactions-management-datatable.component.scss'
})
export class TransactionsManagementDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	readonly status: InputSignal<Status> = input.required<Status>();

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

	private onSearch(): void {
		// this.subscriptions = this.reservationManagementService.search$.subscribe(
		// 	(event) => {
		// 		this.dataSource.filter = event.trim().toLowerCase();
		// 	});
	}

	private onReload(): void {
		// this.subscriptions = this.reservationManagementService.reload$.subscribe(() => {
		// 	this.findAll();
		// })
	}

	protected readonly Status = Status;
}
