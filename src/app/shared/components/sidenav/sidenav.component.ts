import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { CommonModule } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
	selector: 'app-sidenav',
	imports: [
		CommonModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatSidenavModule,
		MatListModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatExpansionModule,
		RouterOutlet,
		RouterLink,
	],
	templateUrl: './sidenav.component.html',
	styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

	@ViewChild('drawer') sidenav!: MatSidenav;
	opened = true;
	title = 'Guardião de Chaves';
	menuOptions = MENU_OPTIONS;

	toggleDrawer(): void {
		this.opened = !this.opened;
	}
}

export interface MenuOptions {
	title: string;
	icon: string;
	route: string;
	subMenu?: MenuOptions[];
	permission?: string[];
}

export const MENU_OPTIONS: MenuOptions[] = [
	{
		title: 'Empréstimos',
		icon: 'schedule',
		route: '/transacoes',
	},
	{
		title: 'Agendamentos',
		icon: 'calendar_month',
		route: '.',
	},
	{
		title: 'Solicitantes',
		icon: 'work',
		route: '/autorizacoes',
	},
	{
		title: 'Relatórios',
		icon: 'description',
		route: '.',
	},
	{
		title: 'Gerenciar',
		icon: 'group_add',
		route: '/recursos',
	},
];

