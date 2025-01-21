import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const PATH_API_URL = environment.apiUrl;

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {

	constructor(private http: HttpClient, private router: Router) {
	}

	login(username: string, password: string): Observable<string> {
		const url = `${ PATH_API_URL }/login`;
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		const body = { username, password };

		return this.http.post<{ access_token: string }>(url, body, { headers }).pipe(
			map((response) => {
				const token = response.access_token;
				this.setToken(token);
				this.router.navigate(['/recursos']);
				return token;
			}),
			catchError(() => {
				return throwError(() => new Error('Login failed'));
			})
		);
	}

	private setToken(token: string): void {
		localStorage.setItem('Authorization', token);
	}

	getToken(): string | null {
		return localStorage.getItem('Authorization');
	}

	isAuthenticated(): boolean {
		const token = this.getToken();
		return !!token;
	}

	logout(): void {
		localStorage.removeItem('Authorization');
		this.router.navigate(['/login']);
	}
}
