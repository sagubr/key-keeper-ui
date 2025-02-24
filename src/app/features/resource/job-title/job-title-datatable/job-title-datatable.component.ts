import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
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
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { finalize, Subscription } from "rxjs";
import { JobTitle } from "@openapi/model/jobTitle";
import { JobTitleService } from "@openapi/api/jobTitle.service";
import { MatIcon } from "@angular/material/icon";
import { MatFabButton, MatIconButton } from "@angular/material/button";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatProgressBar } from "@angular/material/progress-bar";
import {
	JobTitleDialogFormComponent
} from "@app/features/resource/job-title/job-title-form-dialog/job-title-dialog-form.component";
import { MatDialog } from "@angular/material/dialog";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";

@Component({
	selector: 'app-job-title-datatable',
	imports: [
		MatCell,
		MatColumnDef,
		MatHeaderCell,
		MatHeaderRow,
		MatIcon,
		MatIconButton,
		MatMenu,
		MatMenuItem,
		MatPaginator,
		MatProgressBar,
		MatRow,
		MatSort,
		TableWrapperTable,
		MatMenuTrigger,
		MatNoDataRow,
		MatHeaderCellDef,
		MatCellDef,
		MatHeaderRowDef,
		MatRowDef,
		MatFabButton,
		MatFormField,
		MatInput,
		MatLabel,
		MatSuffix,
		MatToolbar,
		MatToolbarRow
	],
	templateUrl: './job-title-datatable.component.html',
	styleUrl: './job-title-datatable.component.scss'
})
export class JobTitleDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<JobTitle> = new MatTableDataSource<JobTitle>([]);
	columns: Columns<JobTitle>[] = [
		{
			definition: 'name',
			header: 'Cargo',
			type: ColumnType.TEXT,
			cell: (jobTitle: JobTitle) => jobTitle.name
		},
		{
			definition: 'created_at',
			header: 'Criado em',
			type: ColumnType.DATE,
			cell: (jobTitle: JobTitle) => jobTitle.createdAt
		},
		{
			definition: 'update_at',
			header: 'Atualizado em',
			type: ColumnType.DATE,
			cell: (jobTitle: JobTitle) => jobTitle.updatedAt
		}
	];
	displayedColumns: string[] = [...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private readonly jobTitleService: JobTitleService,
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
		const dialogRef = this.dialog.open(JobTitleDialogFormComponent, {
			data: {},
		});
		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	openEditDialog(data: JobTitle) {
		const dialogRef = this.dialog.open(JobTitleDialogFormComponent, {
			data,
			width: '540px'
		});

		dialogRef.afterClosed().subscribe({
			next: (val) => {
				if (val) {
					this.findAll();
				}
			}
		});
	}

	private findAll(): void {
		this.loading = true;
		this.jobTitleService
			.findAllJobTitle()
			.pipe(finalize(
				() => this.loading = false
			))
			.subscribe({
				next: (JobTitle) => {
					this.dataSource.data = JobTitle;
				}
			});
	}

}

