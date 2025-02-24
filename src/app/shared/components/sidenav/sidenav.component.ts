import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { CommonModule } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";

@Component({
	selector: 'app-sidenav',
	imports: [
		CommonModule,
		MatToolbarModule,
		MatButtonModule,
		MatSidenavModule,
		MatListModule,
		MatBadgeModule,
		MatIconModule,
		MatExpansionModule,
		RouterOutlet,
		RouterLink,
		MatTooltipModule,
		MatMenuModule
	],
	templateUrl: './sidenav.component.html',
	styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

	@ViewChild('drawer') sidenav!: MatSidenav;

	opened = true;
	menuOptions: Section[] = MENU_OPTIONS;
	menuOptionsSettings: Section[] = MENU_OPTIONS_SETTINGS;

	toggleDrawer(): void {
		this.opened = !this.opened;
	}

}

export interface Section {
	title: string,
	description?: string,
	icon: string,
	route: string,
	permission?: string[],
	disabled?: boolean
}

export const MENU_OPTIONS: Section[] = [
	{
		title: 'Empréstimos',
		description: 'Gestão de solicitações',
		icon: 'assignment_return',
		route: '/transacoes',
	},
	{
		title: 'Agendamentos',
		description: 'Calendário de eventos',
		icon: 'event',
		route: '.',
		disabled: true
	},
	{
		title: 'Autorizações',
		description: 'Gestão de solicitações',
		icon: 'verified_user',
		route: '/autorizacoes',
	},
	{
		title: 'Relatórios',
		description: 'Relatórios de uso',
		icon: 'bar_chart',
		route: '.',
		disabled: true
	},
	{
		title: 'Recursos',
		description: 'Gestão de recursos',
		icon: 'inventory',
		route: '/recursos',
	},
];

export const MENU_OPTIONS_SETTINGS: Section[] = [
	{
		title: 'Parametrizações',
		description: 'Configurações da aplicação',
		icon: 'tune',
		route: '/configuracoes/definicoes',
	},
	{
		title: 'Gestão de Acessos',
		description: 'Configurações de usuários e suas permissões de acesso',
		icon: 'admin_panel_settings',
		route: '/configuracoes/acessos',
	},
	{
		title: 'Registros',
		description: 'Armazena registros de eventos',
		icon: 'receipt_long',
		route: '/configuracoes/registros',
		disabled: true
	}
];

