import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Permissions } from "@openapi/model/permissions";

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private readonly TOKEN_KEY = 'Authorization';

	constructor(private http: HttpClient, private router: Router) {
	}

	login(username: string, password: string): Observable<string> {
		const url = `${ environment.apiUrl }/login`;
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

		return this.http.post<{ access_token: string }>(url, { username, password }, { headers }).pipe(
			map((response) => {
				this.setToken(response.access_token);
				this.router.navigate(['/recursos']);
				return response.access_token;
			}),
			catchError(() => throwError(() => new Error('Login falhou')))
		);
	}

	isAuthenticated(): boolean {
		return !!this.getToken();
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

	private setToken(token: string): void {
		sessionStorage.setItem(this.TOKEN_KEY, token);
	}

}
