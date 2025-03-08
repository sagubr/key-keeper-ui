import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { Columns, ColumnType, TableWrapper } from "@app/shared/components/table-wrapped/table-wrapper";
import { finalize, Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { Permission } from "@openapi/model/permission";
import {
	PermissionFormDialogComponent
} from "@app/features/authorization/permission/permission-form-dialog/permission-form-dialog.component";
import { PermissionService } from "@openapi/api/permission.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import {
	PermissionShowMoreDialogComponent
} from "@app/features/authorization/permission/permission-show-more-dialog/permission-show-more-dialog.component";
import { MatChipsModule } from "@angular/material/chips";
import { DialogWrappedInfo, DialogWrappedService } from "@app/shared/components/dialog-wrapped/dialog-wrapped.service";


@Component({
	selector: 'app-permission-datatable',
	imports: [
		MatTableModule,
		MatIconModule,
		MatMenuModule,
		MatButtonModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatSortModule,
		TableWrapper,
		MatFormFieldModule,
		MatInputModule,
		MatToolbarModule,
		MatChipsModule
	],
	templateUrl: './permission-datatable.component.html',
	styleUrl: './permission-datatable.component.scss'
})
export class PermissionDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<Permission> = new MatTableDataSource<Permission>([]);
	columns: Columns<Permission>[] = [
		{
			definition: 'description',
			header: 'Descrição',
			type: ColumnType.TEXT,
			cell: (permission: Permission) => permission.description
		},
	];
	displayedColumns: string[] = ['requester', 'location', ...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private permissionService: PermissionService,
		private dialog: MatDialog,
		private dialogWrapped: DialogWrappedService
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

	openDeleteDialog(element: Permission): void {

		this.dialogWrapped.openFeedback(
			{
				title: 'Você tem certeza que deseja excluir essa permissão?',
				message: `A ação realizará uma exclusão lógica desse registro e não será mais possível atribuir para novos empŕestimos.`,
				hideCancel: true,
				icon: "warning"
			} as DialogWrappedInfo).afterClosed().subscribe(
			{
				next: (res) => {
					if (res) {
						this.permissionService.deleteByIdPermission(element.id!)
							.subscribe(
								{
									next: () => {
										this.dialogWrapped.openFeedback(
											{
												title: 'O registro foi excluído com suceso',
												message: `Esta permissão ainda se manterá no histórico dos empŕestimos já ocorridos.`,
												icon: "success"
											} as DialogWrappedInfo).afterClosed().subscribe(() => this.onReload());
									},
									error: () => {
										this.dialogWrapped.openFeedback(
											{
												title: 'Não foi possível concluir o registro',
												message: ``,
												icon: "danger"
											} as DialogWrappedInfo).afterClosed().subscribe();
									},
								}
							)
					}
				}
			}
		);
	}

	openCreateDialog(): void {
		this.dialog.open(PermissionFormDialogComponent, {
			data: {},
		}).afterClosed().subscribe(() => this.onReload());
	}

	openEditDialog(data: Permission) {
		this.dialog.open(PermissionFormDialogComponent, {
			data
		}).afterClosed().subscribe(() => this.findAll());
	}

	openShowMoreDialog(data: string[]) {
		this.dialog.open(PermissionShowMoreDialogComponent, {
			data: { array: data }
		}).afterClosed().subscribe(() => this.findAll());
	}

	requesters(permission: Permission, limit: number = 2): { displayText: string; showMore: boolean; array: string[] } {
		const names = permission.requesters?.map(it => it.name).filter(name => name) || [];
		const displayText = names.length > limit
			? `${ names.slice(0, limit).join(', ') }`
			: names.join(', ');

		return { displayText, showMore: names.length > limit, array: names };
	}

	locations(permission: Permission, limit: number = 2): { displayText: string; showMore: boolean; array: string[] } {
		const names = permission.locations?.map(it => it.name).filter(name => name) || [];
		const displayText = names.length > limit
			? `${ names.slice(0, limit).join(', ') }`
			: names.join(', ');

		return { displayText, showMore: names.length > limit, array: names };
	}


	private findAll(): void {
		this.loading = true;
		this.permissionService.findAllPermission()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (permissions) => {
				this.dataSource.data = permissions;
			}
		});
	}
}
