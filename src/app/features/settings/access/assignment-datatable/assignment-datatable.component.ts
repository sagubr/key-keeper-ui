import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
	MatCell,
	MatCellDef,
	MatColumnDef,
	MatHeaderCell, MatHeaderCellDef,
	MatHeaderRow,
	MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTableDataSource
} from "@angular/material/table";
import { MatFabButton, MatIconButton } from "@angular/material/button";
import { MatFormField, MatFormFieldModule, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatMenu, MatMenuItem, MatMenuModule } from "@angular/material/menu";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBar, MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatToolbar, MatToolbarModule, MatToolbarRow } from "@angular/material/toolbar";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { User } from "@openapi/model/user";
import { finalize, Subscription } from "rxjs";
import { UsersService } from "@openapi/api/users.service";
import { MatDialog } from "@angular/material/dialog";
import { UserFormDialogComponent } from "@app/features/settings/access/user-form-dialog/user-form-dialog.component";
import { UserDto } from "@openapi/model/userDto";
import { DialogWrappedComponent } from "@app/shared/components/dialog-wrapped/dialog-wrapped.component";
import {
	AssignmentFormDialogComponent
} from "@app/features/settings/access/assignment-form-dialog/assignment-form-dialog.component";

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
		TableWrapperTable,
		MatNoDataRow,
		MatHeaderCellDef,
		MatFabButton,
		MatIconButton
	],
	templateUrl: './assignment-datatable.component.html',
	styleUrl: './assignment-datatable.component.scss'
})
export class AssignmentDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
	columns: Columns<User>[] = [
		{
			definition: 'name',
			header: 'Nome Completo',
			type: ColumnType.TEXT,
			cell: (user: User) => user.name
		},
		{
			definition: 'username',
			header: 'Usuário',
			type: ColumnType.TEXT,
			cell: (user: User) => user.username
		},
		{
			definition: 'email',
			header: 'E-mail',
			type: ColumnType.TEXT,
			cell: (user: User) => user.email
		}
	];
	displayedColumns: string[] = [...this.columns.map(c => c.definition), 'star'];
	pageSizeOptions = [5, 10, 20, 50, 100];

	loading: boolean = false;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private usersService: UsersService,
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
		const dialogRef = this.dialog.open(AssignmentFormDialogComponent, {
			data: {},
			minWidth: '780px'
		});
		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	openEditDialog(data: UserDto) {
		const dialogRef = this.dialog.open(AssignmentFormDialogComponent, {
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

	openResetPasswordDialog(element: UserDto): void {
		const dialogRef = this.dialog.open(DialogWrappedComponent,
			{
				data: {
					title: 'Tem certeza que deseja redefinir a senha?',
					message: `A senha atual será redefinida e a nova senha será enviada para o e-mail cadastrado: ${ element.email }`,
					icon: 'warning',
					color: 'warn',
					confirmText: 'Confirmar',
					hideCancel: true
				},
				width: '400px'
			});
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
		})
	}

	openBlockUserDialog(element: UserDto): void {
		const dialogRef = this.dialog.open(DialogWrappedComponent,
			{
				data: {
					title: 'Tem certeza que deseja bloquear o usuário?',
					message: `O usuário ${ element.username } não consiguirá acessar a aplicação. Esta ação só poderá ser revertida via banco de dados.`,
					icon: 'warning',
					color: 'warn',
					confirmText: 'Confirmar',
					hideCancel: true
				},
				width: '400px'
			});
		dialogRef.afterClosed().subscribe(res => {
			console.log(res);
		})
	}


	private findAll(): void {
		this.loading = true;
		this.usersService.findAllUsers()
			.pipe(
				finalize(() => this.loading = false)
			).subscribe({
			next: (users) => {
				this.dataSource.data = users;
			},
			error: (err) => {
				console.error('Error fetching user data:', err);
			}
		});
	}
}
