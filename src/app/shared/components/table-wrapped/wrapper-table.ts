import { DataSource } from '@angular/cdk/collections';
import {
	AfterContentInit,
	Component,
	ContentChildren,
	QueryList,
	ViewChild,
	ContentChild,
	input, InputSignal, OnInit,
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
import { NgForOf } from "@angular/common";
import { Column } from "@app/shared/components/model/column.model";

/**
 * Table component that accepts column and row definitions in its content to be registered to the
 * table.
 */
@Component({
	selector: 'wrapper-table',
	templateUrl: 'wrapper-table.html',
	styles: `
		table {
			width: 100%;
		}
	`,
	imports: [MatTableModule, MatSortModule, NgForOf],
	standalone: true
})
export class WrapperTable<T> implements AfterContentInit, OnInit {
	@ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
	@ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<T>>;
	@ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;
	@ContentChild(MatNoDataRow) noDataRow!: MatNoDataRow;

	@ViewChild(MatTable, { static: true }) table!: MatTable<T>;
	@ViewChild(MatSort, { static: true }) sort!: MatSort;

	readonly columns: InputSignal<Columns[]> = input.required<Columns[]>();
	readonly dataSource: InputSignal<DataSource<T>> = input.required<DataSource<T>>();

	ngOnInit(){
		this.columns().forEach(
			it => {
				console.log(it.cell)
			}
		)
	}

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
	cell?: (element: any) => string;
}
