import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatTab, MatTabGroup, MatTabLabel } from "@angular/material/tabs";
import {
	TransactionsManagementDatatableComponent
} from "@app/features/transactions-management/transactions-management-datatable/transactions-management-datatable.component";
import { Status } from "@openapi/model/status";
import {
	TransactionsManagementFiltersComponent
} from "@app/features/transactions-management/transactions-management-filters/transactions-management-filters.component";

@Component({
  selector: 'app-transactions-management',
	imports: [
		MatIcon,
		MatTab,
		MatTabGroup,
		MatTabLabel,
		TransactionsManagementDatatableComponent,
		TransactionsManagementFiltersComponent
	],
  templateUrl: './transactions-management.component.html',
  styleUrl: './transactions-management.component.scss'
})
export class TransactionsManagementComponent {


	activeTabIndex = 0; // Índice da tab ativa
	tabs = ['in-progress', 'scheduled', 'completed']; // Identificadores para cada tab

	onTabChange(index: number): void {
		this.activeTabIndex = index; // Atualiza o índice da tab ativa
		const activeTab = this.tabs[index]; // Identifica a tab pelo índice

		// Faça a requisição correta com base na tab ativa
		this.loadDataForTab(activeTab);
	}

	loadDataForTab(tab: string): void {
		console.log(`Carregando dados para a aba: ${tab}`);
		switch (tab) {
			case 'in-progress':
				this.fetchInProgressData();
				break;
			case 'scheduled':
				this.fetchScheduledData();
				break;
			case 'completed':
				this.fetchCompletedData();
				break;
			default:
				console.warn('Tab desconhecida!');
		}
	}

	fetchInProgressData(): void {
		// Lógica para buscar dados de empréstimos em andamento
		console.log('Buscando dados de empréstimos em andamento...');
	}

	fetchScheduledData(): void {
		// Lógica para buscar dados de reservas agendadas
		console.log('Buscando dados de reservas agendadas...');
	}

	fetchCompletedData(): void {
		// Lógica para buscar dados do histórico de reservas
		console.log('Buscando dados do histórico de reservas...');
	}

	protected readonly Status = Status;
}
