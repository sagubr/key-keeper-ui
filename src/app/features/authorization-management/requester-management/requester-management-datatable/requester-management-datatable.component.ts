import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { finalize, Subscription } from "rxjs";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { UserDto } from "@openapi/model/userDto";
import { CommonModule } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Requester } from "@openapi/model/requester";
import {
	RequesterManagementDialogFormComponent
} from "@app/features/authorization-management/requester-management/requester-management-dialog-form/requester-management-dialog-form.component";
import { RequesterService } from "@openapi/api/requester.service";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";

@Component({
	selector: 'app-requester-management-datatable',
	imports: [
		CommonModule,
		MatTableModule,
		MatPaginatorModule,
		MatDialogModule,
		MatProgressBarModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatSort,
		TableWrapperTable,
		MatFormField,
		MatInput,
		MatLabel,
		MatSuffix,
		MatToolbar,
		MatToolbarRow,
	],
	templateUrl: './requester-management-datatable.component.html',
	styleUrl: './requester-management-datatable.component.scss'
})
export class RequesterManagementDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<Requester> = new MatTableDataSource<Requester>([]);
	columns: Columns<Requester>[] = [
		{
			definition: 'name',
			header: 'Name',
			type: ColumnType.TEXT,
			cell: (requester: Requester) => requester.name
		},
		{
			definition: 'jobTitle',
			header: 'Cargo',
			type: ColumnType.TEXT,
			cell: (requester: Requester) => requester.jobTitle?.name
		},
		{
			definition: 'email',
			header: 'Email',
			type: ColumnType.TEXT,
			cell: (requester: Requester) => requester.email
		}
	];
	displayedColumns: string[] = ['info', ...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private requesterService: RequesterService,
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
		const dialogRef = this.dialog.open(RequesterManagementDialogFormComponent, {
			data: {},
		});

		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	openEditDialog(data: UserDto) {
		const dialogRef = this.dialog.open(RequesterManagementDialogFormComponent, {
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

	private findAll(): void {
		this.loading = true;
		this.requesterService.findAllRequesters()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (requester) => {
				this.dataSource.data = requester;
			},
			error: (err) => {
				console.error('Error fetching user data:', err);
			}
		});
	}

}
