import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

export const CUSTOM_DATE_LOCALE = 'pt-BR';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
	override itemsPerPageLabel = 'Itens por página:';
	override nextPageLabel = 'Próxima página';
	override previousPageLabel = 'Página anterior';
	override firstPageLabel = 'Primeira página';
	override lastPageLabel = 'Última página';

	override getRangeLabel = (page: number, pageSize: number, length: number) => {
		if (length === 0) return `0 de ${length}`;
		const start = page * pageSize + 1;
		const end = Math.min((page + 1) * pageSize, length);
		return `${start} – ${end} de ${length}`;
	};
}

export const SORT_HEADER_LABELS: Record<string, string> = {
	name: 'Nome',
	date: 'Data',
	actions: 'Ações'
};

export const ERROR_MESSAGES = {
	required: 'Campo obrigatório',
	email: 'E-mail inválido',
	minlength: (min: number) => `Mínimo de ${min} caracteres`,
	maxlength: (max: number) => `Máximo de ${max} caracteres`
};
