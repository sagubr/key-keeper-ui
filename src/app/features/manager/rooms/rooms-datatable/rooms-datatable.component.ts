/*Angular Core */
import {
	AfterViewInit,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

/**Angular Material */
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

/**Angular Material Modules */
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

/**Custom Components */
import { UsersService } from '@openapi/api/users.service';
import { UserCommunicationService } from "@app/features/manager/users/user-communication.service";
import { User } from "@openapi/model/user";

@Component({
	selector: 'app-rooms-datatable',
	standalone: true,
	imports: [
		CommonModule,
		MatDialogModule,
		MatTableModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
	],
	templateUrl: './rooms-datatable.component.html',
	styleUrl: './rooms-datatable.component.scss',
})
export class RoomsDatatableComponent
	implements AfterViewInit, OnInit, OnDestroy {
	users: User[] = [];
	dataSource = new MatTableDataSource<User>(this.users);
	displayedColumns: string[] = [
		'name',
		'username',
		'email',
		'active',
		'created_at',
		'updated_at',
		'star',
	];
	pageSizeOptions = [5, 10, 20, 50, 100];

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	private _subscription?: Subscription;

	constructor(
		public dialog: MatDialog,
		private readonly _userCommunicationService: UserCommunicationService,
		private readonly _userService: UsersService
	) {
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}

	ngOnInit() {


		this._subscription?.add(
			this._userCommunicationService.userSaved$.subscribe(() => {
				this.fetch();
			})
		)
		this.fetch();
	}

	ngOnDestroy() {
		this._subscription?.unsubscribe();
	}

	applyFilter(event: String) {
		this.dataSource.filter = event.trim().toLowerCase();
	}

	fetch() {
		this._userService.getAllUsers().subscribe((res) => {
			this.dataSource.data = res;
		});
	}
}
