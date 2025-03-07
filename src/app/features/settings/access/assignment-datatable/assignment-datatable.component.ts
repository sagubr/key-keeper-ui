import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { MatFabButton, MatIconButton } from "@angular/material/button";
import { MatFormFieldModule, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatToolbarModule, MatToolbarRow } from "@angular/material/toolbar";
import { Columns, ColumnType, TableWrapper } from "@app/shared/components/table-wrapped/table-wrapper";
import { finalize, Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { UserDto } from "@openapi/model/userDto";
import {
	AssignmentFormDialogComponent
} from "@app/features/settings/access/assignment-form-dialog/assignment-form-dialog.component";
import { Assignment } from "@openapi/model/assignment";
import { AssignmentService } from "@openapi/api/assignment.service";
import { MatChipsModule } from "@angular/material/chips";
import {
	AssignmentShowMoreDialogComponent
} from "@app/features/settings/access/assignment-show-more-dialog/assignment-show-more-dialog.component";
import { ACTIONS_MAP, ActionsService } from "@app/core/services/actions.service";
import { UpperCasePipe } from "@angular/common";

@Component({
	selector: 'app-assignment-datatable',
	imports: [
		MatCell,
		MatCellDef,
		MatColumnDef,
		MatFormFieldModule,
		MatHeaderCell,
		MatHeaderRow,
		MatHeaderRowDef,
		MatIconModule,
		MatInputModule,
		MatLabel,
		MatMenuModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatRow,
		MatRowDef,
		MatSortModule,
		MatSuffix,
		MatToolbarModule,
		MatToolbarRow,
		TableWrapper,
		MatNoDataRow,
		MatHeaderCellDef,
		MatFabButton,
		MatIconButton,
		MatChipsModule,
		UpperCasePipe,
	],
	templateUrl: './assignment-datatable.component.html',
	styleUrl: './assignment-datatable.component.scss'
})
export class AssignmentDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<Assignment> = new MatTableDataSource<Assignment>([]);
	columns: Columns<Assignment>[] = [
		{
			definition: 'name',
			header: 'Denominação Atribuição',
			type: ColumnType.TEXT,
			cell: (element: Assignment) => element.name
		},
	];
	displayedColumns: string[] = [...this.columns.map(c => c.definition), 'screens', 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private readonly service: AssignmentService,
		private readonly actionService: ActionsService,
		private readonly dialog: MatDialog,
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
		this.dialog.open(AssignmentFormDialogComponent, {
			data: {},
			minWidth: '780px'
		}).afterClosed().subscribe(() => this.onReload());
	}

	openEditDialog(data: UserDto) {
		this.dialog.open(AssignmentFormDialogComponent, {
			data,
			minWidth: '780px'
		}).afterClosed().subscribe(() => this.findAll());
	}

	openShowMoreDialog(data: string[]) {
		this.dialog.open(AssignmentShowMoreDialogComponent, {
			data: { array: data }
		}).afterClosed().subscribe(() => this.findAll());
	}

	permissions(assignment: Assignment, limit: number = 2): {
		displayText: string;
		showMore: boolean;
		array: string[]
	} {
		const names = (assignment.permissions || []).map(permission => {
			const action = ACTIONS_MAP.find(action => action.permission === permission);
			return action ? action.description : permission.toString();
		});

		const displayText = names.length > limit
			? `${ names.slice(0, limit).join(', ') }`
			: names.join(', ');
		return { displayText, showMore: names.length > limit, array: names };
	}

	private findAll(): void {
		this.loading = true;
		this.service.findByActiveTrueAssignment()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (res) => {
				this.dataSource.data = res;
			},
			error: (err) => {
				console.error('Error:', err);
			}
		});
	}
}
