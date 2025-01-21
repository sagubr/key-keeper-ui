import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthenticationService } from "@app/core/services/authentication.service";
import { SidenavComponent } from "@app/shared/components/sidenav/sidenav.component";
import { NavbarComponent } from "@app/shared/components/navbar/navbar.component";

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		CommonModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatSidenavModule,
		MatListModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		RouterLink,
		SidenavComponent,
		NavbarComponent,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {

	@ViewChild('snav') sidenav!: MatSidenav;

	toggleSidenav() {
		this.sidenav.toggle();
	}

}
