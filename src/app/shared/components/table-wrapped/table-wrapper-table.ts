import { DataSource } from '@angular/cdk/collections';
import {
	AfterContentInit,
	Component,
	ContentChild,
	ContentChildren,
	input,
	InputSignal,
	QueryList,
	ViewChild
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
	MatColumnDef,
	MatHeaderRowDef,
	MatNoDataRow,
	MatRowDef,
	MatTable,
	MatTableModule,
} from '@angular/material/table';
import { DatePipe, NgForOf, NgIf } from "@angular/common";

/**
 * Table component that accepts column and row definitions in its content to be registered to the
 * table.
 */
@Component({
	selector: 'table-wrapper-table',
	templateUrl: 'table-wrapper-table.html',
	styleUrl: 'table-wrapper-table.scss',
	imports: [MatTableModule, MatSortModule, NgForOf, DatePipe, NgIf],
	standalone: true
})
export class TableWrapperTable<T> implements AfterContentInit {

	@ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
	@ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<T>>;
	@ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;
	@ContentChild(MatNoDataRow) noDataRow!: MatNoDataRow;

	@ViewChild(MatTable, { static: true }) table!: MatTable<T>;
	@ViewChild(MatSort, { static: true }) sort!: MatSort;

	readonly columns: InputSignal<Columns[]> = input.required<Columns[]>();
	readonly dataSource: InputSignal<DataSource<T>> = input.required<DataSource<T>>();

	ngAfterContentInit() {
		this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
		this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
		this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
		this.table.setNoDataRow(this.noDataRow);
	}
}

export interface Columns {
	columnDef: string;
	header: string;
	type: 'text' | 'number' | 'date';
	cell: (element: any) => any;
}