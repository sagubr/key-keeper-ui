import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';
import { AuthenticationGuard } from './core/guards/authentication.guard';

import { ResourceManagementComponent } from '@app/features/resource-management/resource-management.component';
import {
	AuthorizationManagementComponent
} from "@app/features/authorization-management/authorization-management.component";
import {
	TransactionsManagementComponent
} from "@app/features/transactions-management/transactions-management.component";
import { SidenavComponent } from "@app/shared/components/sidenav/sidenav.component";
import {
	RequesterManagementComponent
} from "@app/features/authorization-management/requester-management/requester-management.component";
import {
	PermissionManagementComponent
} from "@app/features/authorization-management/permission-management/permission-management.component";
import { UserManagementComponent } from "@app/features/resource-management/user-management/user-management.component";
import { RegistersManagementComponent } from "@app/settings/registers-management/registers-management.component";
import { DefinitionsManagementComponent } from "@app/settings/definitions-management/definitions-management.component";

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
			{ path: 'recursos', component: ResourceManagementComponent },
			{
				path: 'autorizacoes',
				component: AuthorizationManagementComponent,
				children: [
					{
						path: 'solicitantes',
						component: RequesterManagementComponent
					},
					{
						path: 'permissoes',
						component: PermissionManagementComponent
					}
				]
			},
			{ path: 'transacoes', component: TransactionsManagementComponent },
			{
				path: 'configuracoes',
				children: [
					{ path: 'definicoes', component: DefinitionsManagementComponent },
					{ path: 'usuarios', component: UserManagementComponent },
					{ path: 'registros', component: RegistersManagementComponent }
				]
			},
			{ path: '', redirectTo: 'recursos', pathMatch: 'full' }
		]
	},
	{ path: '**', redirectTo: 'login' }
];
