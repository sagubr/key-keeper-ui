/*Angular Core */
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

/*Angular Material Modules*/
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/*Custom Components*/
import { UsersComponent } from './users/users.component';
import {RoomsComponent} from "@app/features/manager/rooms/rooms.component";

@Component({
  selector: 'app-manager',
  standalone: true,
	imports: [
		CommonModule,
		MatTabsModule,
		MatIconModule,
		MatProgressBarModule,
		RouterLink,
		UsersComponent,
		RoomsComponent,
	],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss',
})
export class ManagerComponent {}
