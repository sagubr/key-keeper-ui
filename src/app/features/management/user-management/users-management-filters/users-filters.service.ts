import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserFilterService {
  private _filterSubject = new BehaviorSubject<String>('');
  filter$ = this._filterSubject.asObservable();

  setFilter(filter: String) {
    this._filterSubject.next(filter);
  }
}
