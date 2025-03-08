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
import { ReservationChangeStatusCommand } from "@openapi/model/reservationChangeStatusCommand";
import { UpperCasePipe } from "@angular/common";
import { DialogWrappedInfo, DialogWrappedService } from "@app/shared/components/dialog-wrapped/dialog-wrapped.service";
import {
	TransactionsProlongationFormDialogComponent
} from "@app/features/transactions/transactions-prolongation-form-dialog/transactions-prolongation-form-dialog.component";

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
		TableWrapper,
		MatFormFieldModule,
		MatInputModule,
		MatToolbarModule,
		UpperCasePipe,
	],
	templateUrl: './transactions-datatable-progress.component.html',
	styleUrl: './transactions-datatable-progress.component.scss'
})
export class TransactionsDatatableProgressComponent implements OnInit, AfterViewInit, OnDestroy {

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
	displayedColumns: string[] = ['info', ...this.columns.map(c => c.definition), 'action', 'menu'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private readonly reservationService: ReservationService,
		private readonly dialog: MatDialog,
		private readonly dialogWrapped: DialogWrappedService
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
		}).afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	openProlongationDialog(element: Reservation): void {
		this.dialog.open(TransactionsProlongationFormDialogComponent, {
			minWidth: '540px',
			data: element,
		}).afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	openDialogConfirmChangeStatus(element: Reservation, status: Status): void {
		this.dialogWrapped.openFeedback(
			{
				title: "Confirmação de Mudança de Status",
				message: `O registro da ${ element.location?.name } para ${ element.requester?.name } terá o seu status alterado. Você confirma essa ação?`,
				icon: "warning"
			} as DialogWrappedInfo
		).afterClosed().subscribe((res) => {
			if (res) {
				this.changeStatus(element, status);
			}
		})
	}

	private changeStatus(element: Reservation, status: Status): void {
		const command: ReservationChangeStatusCommand = {
			reservationId: element.id!,
			status: status
		}
		this.reservationService.changeStatusReservation(command).subscribe({
			next: (response) => {
				this.dialogWrapped.openFeedback().afterClosed().subscribe(() => this.findAll());
			},
			error: (err) => this.dialogWrapped.openFeedback({
				message: "Não foi possível alterar o status da solicitação",
				icon: "danger"
			} as DialogWrappedInfo).afterClosed().subscribe(() => this.findAll())
		});
	}

	openEditDialog(data: Reservation) {
		this.dialog.open(TransactionsFormDialogComponent, {
			minWidth: '540px',
			data
		}).afterClosed().subscribe(() => this.findAll());
	}

	private findAll(): void {
		this.loading = true;
		this.reservationService.findByActiveTrueAndStatusIn([Status.Emprestimo, Status.Agendado, Status.Atrasado])
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
