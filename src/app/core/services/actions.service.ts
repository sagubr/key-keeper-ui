import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Permissions } from '@openapi/model/permissions';

@Injectable({
	providedIn: 'root',
})
export class ActionsService {
	constructor(private readonly service: AuthenticationService) {
	}

	public hasPermission(permission: Permissions): boolean {
		const roles = this.service.getRoles();
		return roles.includes(permission);
	}
}

export const ACTIONS_MAP = new Map<Permissions, string>([
	[Permissions.Emprestimos, 'Empréstimo'],
	[Permissions.Historico, 'Histórico'],
	[Permissions.Cargos, 'Cargos'],
	[Permissions.Salas, 'Salas'],
	[Permissions.Configuracao, 'Configuração'],
	[Permissions.Instalacoes, 'Instalações'],
	[Permissions.Solicitantes, 'Solicitantes'],
	[Permissions.TipoAmbiente, 'Tipo Ambiente'],
	[Permissions.MenuEmprestimos, 'Menu de Empréstimos'],
]);
