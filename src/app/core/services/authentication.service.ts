import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {CookieService} from "ngx-cookie-service";

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private PATH_API_URL = environment.apiUrl;

	constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {
	}

	login(username: string, password: string): Observable<string> {
		const url = `${this.PATH_API_URL}/login`;
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		const body = {username, password};

		return this.http
			.post<{ access_token: string }>(url, body, {headers})
			.pipe(
				map((response) => {
					const token = response.access_token;
					this.setCookie('Authorization', token, 1); // Armazenando no cookie
					this.router.navigate(['/manager']);
					return token;
				}),
				catchError((error) => {
					return throwError(() => new Error('Login failed'));
				})
			);
	}

	private setCookie(name: string, value: string, days: number): void {
		this.cookieService.set(name, value, {expires: days});
	}

	getToken(): string | null {
		return this.cookieService.get('Authorization');
	}

	isAuthenticated(): boolean {
		const token = this.getToken();
		return !!token;
	}

	logout(): void {
		this.cookieService.delete('Authorization');
		this.router.navigate(['/login']);
	}
}
