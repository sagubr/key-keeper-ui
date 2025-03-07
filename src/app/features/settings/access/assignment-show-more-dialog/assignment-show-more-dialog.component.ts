import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { Columns, ColumnType, TableWrapper } from "@app/shared/components/table-wrapped/table-wrapper";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
	selector: 'app-assignment-show-more-dialog',
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
		MatDialogModule
	],
	templateUrl: './assignment-show-more-dialog.component.html',
	styleUrl: './assignment-show-more-dialog.component.scss'
})
export class AssignmentShowMoreDialogComponent implements OnInit, AfterViewInit {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<string> = new MatTableDataSource<string>([]);
	columns: Columns<string>[] = [
		{
			definition: 'name',
			header: 'Atribuição',
			type: ColumnType.TEXT,
			cell: (assignment: string) => assignment
		},
	];
	displayedColumns: string[] = [...this.columns.map(c => c.definition)];
	pageSizeOptions = [5, 10, 20, 50, 100];

	constructor(
		public dialogRef: MatDialogRef<AssignmentShowMoreDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { array: string[] },
	) {
	}

	ngOnInit(): void {
		this.dataSource.data = this.data.array;
		this.dataSource.filterPredicate = (data: string, filter: string) =>
			data.toLowerCase().includes(filter);
		this.dataSource.sortingDataAccessor = (data: string, sort: string) =>
			data.toLowerCase();
	};

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	onSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
		this.dataSource.filter = value;
	}

}
