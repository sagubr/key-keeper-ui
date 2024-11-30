import { BehaviorSubject, Subject } from "rxjs";

export class ManagementService {

	constructor() {
	}

	private searchSubject = new BehaviorSubject<string>('');
	search$ = this.searchSubject.asObservable();

	private reloadSubject = new Subject<void>();
	reload$ = this.reloadSubject.asObservable();

	/**
	 * Emite um evento de busca com o filtro fornecido.
	 * @param term de busca a ser emitido
	 */
	onSearch(term: string): void {
		this.searchSubject.next(term);
	}

	/**
	 * Emite um evento de recarregamento para os componentes ouvintes.
	 */
	onReload(): void {
		this.reloadSubject.next();
	}
}
