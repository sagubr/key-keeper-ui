import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from "@angular/common";
import {
	MatCell,
	MatCellDef,
	MatColumnDef,
	MatHeaderCell,
	MatHeaderRow,
	MatHeaderRowDef,
	MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatProgressBar } from "@angular/material/progress-bar";
import { User } from "@openapi/model/user";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { UsersService } from "@openapi/api/users.service";


@Component({
	selector: 'app-rooms',
	standalone: true,
	imports: [
		DatePipe,
		MatCell,
		MatCellDef,
		MatColumnDef,
		MatHeaderCell,
		MatHeaderRow,
		MatHeaderRowDef,
		MatIcon,
		MatIconButton,
		MatMenu,
		MatMenuItem,
		MatPaginator,
		MatProgressBar,
		MatRow,
		MatRowDef,
		MatTable,
		MatMenuTrigger,
	],
	templateUrl: './rooms.component.html',
	styleUrl: './rooms.component.scss'
})
export class RoomsComponent {

}
