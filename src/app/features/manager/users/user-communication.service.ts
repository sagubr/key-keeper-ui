import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserCommunicationService {
	private readonly _userSavedSource = new Subject<void>();

	userSaved$ = this._userSavedSource.asObservable();

	emitUserSaved() {
		this._userSavedSource.next();
	}
}
