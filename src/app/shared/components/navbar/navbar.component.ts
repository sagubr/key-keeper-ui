import { Component, OnInit, output } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Facility } from "@openapi/model/facility";
import { NotificationsService } from "@openapi/api/notifications.service";

@Component({
	selector: 'app-navbar',
	imports: [
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
	],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
	title = 'Guardião de Chaves';

	toggle = output<void>()

	constructor(private notifierService: NotificationsService) {
	}

	ngOnInit() {
		// console.log('init')
		// this.notifierService.streamNotifications().subscribe(res =>
		// 	console.log(res)
		// )
	}
}
