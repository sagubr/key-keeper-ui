import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';
import { AuthenticationGuard } from './core/guards/authentication.guard';

import { ResourceComponent } from '@app/features/resource/resource-component';
import {
	AuthorizationManagementComponent
} from "@app/features/authorization/authorization-management.component";
import {
	TransactionsManagementComponent
} from "@app/features/transactions-management/transactions-management.component";
import { SidenavComponent } from "@app/shared/components/sidenav/sidenav.component";
import {
	RequesterManagementComponent
} from "@app/features/authorization/requester-management/requester-management.component";
import {
	PermissionManagementComponent
} from "@app/features/authorization/permission-management/permission-management.component";
import {
	UserManagementComponent
} from "@app/features/settings/user-management/user-management.component";
import { RegistersManagementComponent } from "@app/features/settings/registers-management/registers-management.component";
import { DefinitionsManagementComponent } from "@app/features/settings/definitions-management/definitions-management.component";

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
			{ path: 'recursos', component: ResourceComponent, canActivate: [AuthenticationGuard] },
			{
				path: 'autorizacoes',
				component: AuthorizationManagementComponent,
				canActivate: [AuthenticationGuard],
				children: [
					{
						path: 'solicitantes',
						component: RequesterManagementComponent,
						canActivate: [AuthenticationGuard]
					},
					{
						path: 'permissoes',
						component: PermissionManagementComponent,
						canActivate: [AuthenticationGuard]
					}
				]
			},
			{ path: 'transacoes', component: TransactionsManagementComponent, canActivate: [AuthenticationGuard] },
			{
				path: 'configuracoes',
				canActivate: [AuthenticationGuard],
				children: [
					{
						path: 'definicoes',
						component: DefinitionsManagementComponent,
						canActivate: [AuthenticationGuard]
					},
					{ path: 'usuarios', component: UserManagementComponent, canActivate: [AuthenticationGuard] },
					{ path: 'registros', component: RegistersManagementComponent, canActivate: [AuthenticationGuard] }
				]
			},
			{ path: '', redirectTo: 'recursos', pathMatch: 'full' }
		]
	},
	{ path: '**', redirectTo: 'login' }
];
