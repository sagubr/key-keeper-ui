import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Permissions } from '@openapi/model/permissions';

@Injectable({
	providedIn: 'root',
})
export class ActionsService {

	constructor(
		private readonly authentication: AuthenticationService
	) {
	}

	public hasPermission(permission: Permissions): boolean {
		const roles = this.authentication.getRoles();
		if (this.authentication.isSuper()) {
			return true;
		}
		return roles.includes(permission);
	}

	public hasAnyPermission(permissions: Permissions[]): boolean {
		const roles = this.authentication.getRoles();
		if (this.authentication.isSuper()) {
			return true;
		}
		return permissions.some(permission => roles.includes(permission));
	}

}

export const ACTIONS_MAP: { permission: Permissions; description: string; route: string, warning?: string }[] = [
	{
		permission: Permissions.VerEmprestimos,
		description: 'Visualizar Empréstimos',
		route: '/transacoes',
	},
	{
		permission: Permissions.EditarEmprestimos,
		description: 'Empréstimos - Gerenciamento',
		route: '/transacoes',
		warning: 'Permissão crítica! Permite criação, edição e exclusão de empréstimos.'
	},
	{
		permission: Permissions.VerHistoricos,
		description: 'Visualizar Histórico',
		route: '/transacoes'
	},
	{
		permission: Permissions.EditarHistoricos,
		description: 'Históricos - Gerenciamento',
		route: '/transacoes',
		warning: 'Permissão crítica! Permite criação, edição e exclusão de históricos.'
	},
	{
		permission: Permissions.VerSolicitantes,
		description: 'Visualizar Solicitações',
		route: '/autorizacoes'
	},
	{
		permission: Permissions.EditarSolicitantes,
		description: 'Gerenciar Solicitações',
		route: '/autorizacoes',
		warning: 'Permissão importante! Gerenciar solicitações pode impactar os usuários.'
	},
	{
		permission: Permissions.VerPermissoes,
		description: 'Visualizar Permissões',
		route: '/autorizacoes'
	},
	{
		permission: Permissions.EditarPermissoes,
		description: 'Gerenciar Permissões',
		route: '/autorizacoes',
		warning: 'Permissão crítica! Gerenciar permissões afeta o controle de acesso do sistema.'
	},
	{
		permission: Permissions.VerSalas,
		description: 'Visualizar Salas',
		route: '/recursos'
	},
	{
		permission: Permissions.EditarSalas,
		description: 'Gerenciar Salas',
		route: '/recursos',
		warning: 'Permissão importante! Modifica as configurações das salas no sistema.'
	},
	{
		permission: Permissions.VerTipoAmbiente,
		description: 'Visualizar Tipo de Ambiente',
		route: '/recursos'
	},
	{
		permission: Permissions.EditarTipoAmbiente,
		description: 'Gerenciar Tipo de Ambiente',
		route: '/recursos',
		warning: 'Permissão importante! Alterações podem afetar as configurações de ambientes.'
	},
	{
		permission: Permissions.VerInstalacoes,
		description: 'Visualizar Instalações',
		route: '/recursos'
	},
	{
		permission: Permissions.EditarInstalacoes,
		description: 'Gerenciar Instalações',
		route: '/recursos',
		warning: 'Permissão importante! Modificar instalações pode afetar o funcionamento do sistema.'
	},
	{
		permission: Permissions.VerCargos,
		description: 'Visualizar Cargos',
		route: '/recursos'
	},
	{
		permission: Permissions.EditarCargos,
		description: 'Gerenciar Cargos',
		route: '/recursos',
		warning: 'Permissão importante! Gerencia as permissões e funções no sistema.'
	},
	{
		permission: Permissions.VerConfiguracao,
		description: 'Visualizar Configuração',
		route: '/configuracoes',
		warning: 'Acesso à configuração do sistema. Atenção ao realizar modificações!'
	},
	{
		permission: Permissions.EditarConfiguracao,
		description: 'Gerenciar Configuração',
		route: '/configuracoes',
		warning: 'Permissão crítica! Modificar configurações pode afetar todo o sistema.'
	},
	{
		permission: Permissions.VerUsuarios,
		description: 'Visualizar Usuários',
		route: '/configuracoes/'
	},
	{
		permission: Permissions.EditarUsuarios,
		description: 'Gerenciar Usuários',
		route: '/configuracoes/',
		warning: 'Permissão crítica! Gerenciar usuários pode afetar o acesso ao sistema.'
	}
];
