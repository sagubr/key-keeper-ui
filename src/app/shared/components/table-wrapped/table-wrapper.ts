import { DataSource } from '@angular/cdk/collections';
import {
	AfterContentInit,
	Component,
	ContentChild,
	ContentChildren,
	input,
	InputSignal,
	QueryList,
	ViewChild,
	ViewEncapsulation
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
import { CurrencyPipe, DatePipe, UpperCasePipe } from "@angular/common";
import { JoinPipe } from "@app/core/pipes/JoinPipe";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";

/**
 * Table component that accepts column and row definitions in its content to be registered to the
 * table.
 */
@Component({
	selector: 'table-wrapper',
	templateUrl: 'table-wrapper.html',
	styleUrl: 'table-wrapper.scss',
	imports: [MatTableModule, MatSortModule, MatIconModule, DatePipe, UpperCasePipe, CurrencyPipe, JoinPipe, MatTooltip],
	encapsulation: ViewEncapsulation.None
})
export class TableWrapper<T> implements AfterContentInit {

	@ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
	@ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<T>>;
	@ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;
	@ContentChild(MatNoDataRow) noDataRow!: MatNoDataRow;

	@ViewChild(MatTable, { static: true }) table!: MatTable<T>;
	@ViewChild(MatSort, { static: true }) sort!: MatSort;

	readonly columns: InputSignal<Columns<T>[]> = input.required<Columns<T>[]>();
	readonly dataSource: InputSignal<DataSource<T>> = input.required<DataSource<T>>();

	ngAfterContentInit() {
		this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
		this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
		this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
		this.table.setNoDataRow(this.noDataRow);
	}

	protected readonly ColumnType = ColumnType;
}

export interface Columns<T> {
	definition: string;
	type: ColumnType;
	header: string;
	cell: (element: T) => any;
	hasDescription?: boolean;
	icon?: string;
	description?: (element: T) => any;
}

export enum ColumnType {
	TEXT = 'TEXT',
	DATE = 'DATE',
	DATETIME = 'DATETIME',
	CURRENCY = 'CURRENCY',
	ARRAY = 'ARRAY',
	BOOLEAN = 'BOOLEAN',
	NUMBER = 'NUMBER',
}
