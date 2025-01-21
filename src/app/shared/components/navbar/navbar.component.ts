import { Component, output } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Facility } from "@openapi/model/facility";

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
export class NavbarComponent {
	title = 'Guardião de Chaves';

	toggle = output<void>()
}
