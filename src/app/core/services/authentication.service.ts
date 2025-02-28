import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ACTIONS_MAP } from "@app/core/services/actions.service";

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {

	private readonly TOKEN_KEY = 'Authorization';
	private TOKEN: string = '';

	constructor(private http: HttpClient, private router: Router) {
	}

	login(username: string, password: string): Observable<string> {
		const url = `${ environment.apiUrl }/login`;
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

		return this.http.post<{ access_token: string }>(url, { username, password }, { headers }).pipe(
			map((response) => {
				this.setToken(response.access_token);
				const roles = this.getRoles();
				const firstPermission = roles[0];
				const action = ACTIONS_MAP.find(action => action.permission === firstPermission);

				if (this.isSuper() && ACTIONS_MAP[0]?.route) {
					this.router.navigate([ACTIONS_MAP[0].route]);
					return response.access_token;
				}

				if (action?.route) {
					this.router.navigate([action.route]);
				}

				return response.access_token;
			}),
			catchError(() => throwError(() => new Error('Login falhou')))
		);
	}

	isAuthenticated(): Observable<boolean> {
		const token = this.getToken();
		if (!token) return of(false);
		return of(true);
	}

	logout(): void {
		sessionStorage.removeItem(this.TOKEN_KEY);
		this.router.navigate(['/login']);
	}

	getToken(): string | null {
		if (typeof window !== 'undefined' && sessionStorage) {
			return sessionStorage.getItem(this.TOKEN_KEY);
		}
		return null;
	}

	getUser(): string | undefined{
		const token = this.getToken();
		if (!token) return undefined;

		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.name || [];
		} catch (e) {
			return undefined;
		}
	}

	getRoles(): string[] {
		const token = this.getToken();
		if (!token) return [];

		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.roles || [];
		} catch (e) {
			return [];
		}
	}

	isSuper(): boolean {
		if (this.getRoles().includes("SUPER_USER")) {
			return true;
		}
		return false;
	}

	private setToken(token: string): void {
		this.TOKEN = token;
		sessionStorage.setItem(this.TOKEN_KEY, token);
	}

}
