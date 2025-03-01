import { Routes } from '@angular/router';

import { LoginComponent } from '@app/login/login.component';
import { AuthenticationGuard } from './core/guards/authentication.guard';

import { ResourceComponent } from '@app/features/resource/resource-component';
import { AuthorizationManagementComponent } from "@app/features/authorization/authorization-management.component";
import { TransactionsComponent } from "@app/features/transactions/transactions-component";
import { SidenavComponent } from "@app/shared/components/sidenav/sidenav.component";
import { AccessComponent } from "@app/features/settings/access/access.component";
import { RegistersComponent } from "@app/features/settings/registers/registers.component";
import { DefinitionsComponent } from "@app/features/settings/definitions/definitions.component";
import {
	RequesterDatatableComponent
} from "@app/features/authorization/requester/requester-datatable/requester-datatable.component";
import {
	PermissionDatatableComponent
} from "@app/features/authorization/permission/permission-datatable/permission-datatable.component";
import { Permissions } from '@openapi/model/permissions';
import { UnauthorizedComponent } from "@app/unauthorized/unauthorized.component";

export const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: '',
		component: SidenavComponent,
		canActivate: [AuthenticationGuard],
		children: [
			{
				path: 'recursos',
				component: ResourceComponent,
				canActivate: [AuthenticationGuard],
				data: {
					permissions: [
						Permissions.VerSalas,
						Permissions.EditarSalas,
						Permissions.VerTipoAmbiente,
						Permissions.EditarTipoAmbiente,
						Permissions.VerInstalacoes,
						Permissions.EditarInstalacoes,
						Permissions.VerCargos,
						Permissions.EditarCargos
					]
				}
			},
			{
				path: 'autorizacoes',
				component: AuthorizationManagementComponent,
				canActivate: [AuthenticationGuard],
				data: {
					permissions: [
						Permissions.VerSolicitantes,
						Permissions.EditarSolicitantes,
						Permissions.VerPermissoes,
						Permissions.EditarPermissoes
					]
				},
				children: [
					{
						path: 'solicitantes',
						component: RequesterDatatableComponent,
						canActivate: [AuthenticationGuard],
						data: { permissions: [Permissions.VerSolicitantes, Permissions.EditarSolicitantes] }
					},
					{
						path: 'permissoes',
						component: PermissionDatatableComponent,
						canActivate: [AuthenticationGuard],
						data: { permissions: [Permissions.VerPermissoes, Permissions.EditarPermissoes] }
					}
				]
			},
			{
				path: 'transacoes',
				component: TransactionsComponent,
				canActivate: [AuthenticationGuard],
				data: {
					permissions: [
						Permissions.VerEmprestimos,
						Permissions.EditarEmprestimos,
						Permissions.VerHistoricos,
						Permissions.EditarHistoricos
					]
				}
			},
			{
				path: 'configuracoes',
				canActivate: [AuthenticationGuard],
				children: [
					{
						path: 'definicoes',
						component: DefinitionsComponent,
						canActivate: [AuthenticationGuard],
						data: { permissions: [Permissions.VerConfiguracao, Permissions.EditarConfiguracao] }
					},
					{
						path: 'acessos',
						component: AccessComponent,
						canActivate: [AuthenticationGuard],
						data: { permissions: [Permissions.VerUsuarios, Permissions.EditarUsuarios] }
					},
					{
						path: 'registros',
						component: RegistersComponent,
						canActivate: [AuthenticationGuard]
					}
				]
			},
			{ path: 'nao-autorizado', component: UnauthorizedComponent }
		]
	},
	{ path: '**', redirectTo: 'nao-autorizado' }
];
