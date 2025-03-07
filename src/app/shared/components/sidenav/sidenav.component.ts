import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { AuthenticationService } from "@app/core/services/authentication.service";
import { Permissions } from "@openapi/model/permissions";
import { ActionsService } from "@app/core/services/actions.service";
import { NotificationsService } from "@openapi/api/notifications.service";
import { Notification } from "@openapi/model/notification";
import { interval, Subscription, switchMap } from "rxjs";
import { MatCardModule } from "@angular/material/card";

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
		MatMenuModule,
		MatCardModule
	],
	templateUrl: './sidenav.component.html',
	styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit, OnDestroy {

	@ViewChild('drawer') sidenav!: MatSidenav;

	opened = true;
	menuOptions: Section[] = MENU_OPTIONS;
	menuOptionsSettings: Section[] = MENU_OPTIONS_SETTINGS;


	notificationsVisible = false;
	notifications: Notification[] = [];
	private subscription?: Subscription;

	constructor(
		private readonly authentication: AuthenticationService,
		private readonly notification: NotificationsService,
		private readonly actions: ActionsService
	) {
	}

	ngOnInit(): void {
		this.startNotificationPolling();
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	startNotificationPolling(): void {
		this.notification.findByReadFalse().subscribe(res => this.notifications = res);
		this.subscription = interval(60*1000)
			.pipe(switchMap(() => this.notification.findByReadFalse()))
			.subscribe(res => this.notifications = res);
	}

	toggleNotifications() {
		this.notificationsVisible = !this.notificationsVisible;
	}

	markAsRead(notification: Notification) {
		this.notification.markAsRead(notification.id!).subscribe({
				next: () => {
					this.notifications = this.notifications.filter(it => it.id !== notification.id)
				}
			}
		)

	}


	toggleDrawer(): void {
		this.opened = !this.opened;
	}

	logout(): void {
		this.authentication.logout();
	}

	hasAnyPermission(permission?: Permissions[]): boolean {
		if (!permission) {
			return true;
		}
		return this.actions.hasAnyPermission(permission);
	}

	getUser(): string | undefined {
		return this.authentication.getUser();
	}

}

export interface Section {
	title: string,
	description?: string,
	icon: string,
	route: string,
	permissions?: Permissions[],
	isDisabled?: boolean;
	isHidden?: boolean;
}

export const MENU_OPTIONS: Section[] = [
	{
		title: 'Empréstimos',
		description: 'Gestão de solicitações',
		icon: 'assignment_return',
		route: '/transacoes',
		permissions: ["VER_EMPRESTIMOS", "EDITAR_EMPRESTIMOS", "VER_HISTORICOS", "EDITAR_HISTORICOS"]
	},
	{
		title: 'Agendamentos',
		description: 'Calendário de eventos',
		icon: 'event',
		route: '.',
		isDisabled: true,
	},
	{
		title: 'Autorizações',
		description: 'Gestão de solicitações',
		icon: 'verified_user',
		route: '/autorizacoes',
		permissions: ["VER_SOLICITANTES", "EDITAR_SOLICITANTES", "VER_PERMISSOES", "EDITAR_PERMISSOES"]
	},
	{
		title: 'Relatórios',
		description: 'Relatórios de uso',
		icon: 'bar_chart',
		route: '.',
		isDisabled: true
	},
	{
		title: 'Recursos',
		description: 'Gestão de recursos',
		icon: 'inventory',
		route: '/recursos',
		permissions: ["VER_SALAS", "EDITAR_SALAS", "VER_TIPO_AMBIENTE", "EDITAR_TIPO_AMBIENTE", "VER_INSTALACOES", "EDITAR_INSTALACOES", "VER_CARGOS", "EDITAR_CARGOS"]
	},
];

export const MENU_OPTIONS_SETTINGS: Section[] = [
	{
		title: 'Parametrizações',
		description: 'Configurações da aplicação',
		icon: 'tune',
		route: '/configuracoes/definicoes',
		permissions: ["VER_CONFIGURACAO", "EDITAR_CONFIGURACAO"]
	},
	{
		title: 'Gestão de Acessos',
		description: 'Configurações de usuários e suas permissões de acesso',
		icon: 'admin_panel_settings',
		route: '/configuracoes/acessos',
		permissions: ["VER_USUARIOS", "EDITAR_USUARIOS"]
	},
	{
		title: 'Registros',
		description: 'Armazena registros de eventos',
		icon: 'receipt_long',
		route: '/configuracoes/registros',
		isDisabled: true,
		permissions: []
	},
];

