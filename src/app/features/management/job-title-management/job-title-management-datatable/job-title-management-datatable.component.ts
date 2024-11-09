import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import {
	MatCell,
	MatCellDef,
	MatColumnDef,
	MatHeaderCell, MatHeaderCellDef,
	MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef,
	MatTableDataSource
} from "@angular/material/table";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { finalize, Subscription } from "rxjs";
import { JobTitle } from "@openapi/model/jobTitle";
import { JobTitleService } from "@openapi/api/jobTitle.service";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatProgressBar } from "@angular/material/progress-bar";

@Component({
	selector: 'app-job-title-management-datatable',
	standalone: true,
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
		TableWrapperTable,
		MatMenuTrigger,
		MatHeaderCellDef,
		MatNoDataRow
	],
	templateUrl: './job-title-management-datatable.component.html',
	styleUrl: './job-title-management-datatable.component.scss'
})
export class JobTitleManagementDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

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

	constructor(private readonly _jobTitleService: JobTitleService) {
	}

	ngOnInit(): void {
		this._initializeData();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	private _initializeData(): void {
		this.loading = true;
		this._jobTitleService.findAllJobTitle().pipe(finalize(() => this.loading = false))
			.subscribe({
				next: (JobTitle) => {
					this.dataSource.data = JobTitle;
				},
				error: (err) => {
					console.error('Error fetching user data:', err);
				}
			});
	}
}

