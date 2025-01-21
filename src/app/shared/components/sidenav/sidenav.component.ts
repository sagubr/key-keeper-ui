import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { CommonModule } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";

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
		RouterLink,

	],
	templateUrl: './sidenav.component.html',
	styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
	menuOptions: MenuOptions[] = MENU_OPTIONS;
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

