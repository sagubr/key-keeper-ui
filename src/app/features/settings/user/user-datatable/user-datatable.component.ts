import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort } from "@angular/material/sort";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '@openapi/api/users.service';
import { User } from "@openapi/model/user";
import { Columns, ColumnType, TableWrapperTable } from "@app/shared/components/table-wrapped/table-wrapper-table";
import { UserDto } from "@openapi/model/userDto";
import { UserFormDialogComponent } from "@app/features/settings/user/user-form-dialog/user-form-dialog.component";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";
import { DialogWrappedComponent } from "@app/shared/components/dialog-wrapped/dialog-wrapped.component";

@Component({
	selector: 'app-user-datatable',
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
	templateUrl: './user-datatable.component.html',
	styleUrls: ['./user-datatable.component.scss']
})
export class UserDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

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
		const dialogRef = this.dialog.open(UserFormDialogComponent, {
			data: {},
		});
		dialogRef.afterClosed().subscribe(() => {
			this.onReload();
		});
	}

	openEditDialog(data: UserDto) {
		const dialogRef = this.dialog.open(UserFormDialogComponent, {
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
