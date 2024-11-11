import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const PATH_API_URL = environment.apiUrl;

//TODO: Solução temporária para teste em ambiente Vercel
const TOKEN_DEFAULT_TEMP = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJndXN0YXZvLmdhcmNpYSIsIm5iZiI6MTczMTMzMDgzNSwicm9sZXMiOlsiTUFOQUdFUiJdLCJpc3MiOiJjb3JlIiwiZXhwIjoxNzMxMzM0NDM1LCJpYXQiOjE3MzEzMzA4MzV9.3VdpcuBcmJfJo3alYv2WtMbuuunhQFkM014Ch_-fZKe1-0gLNM3hOxFPzjmiwMzpta0lw4BOd9e3Bq1Ogv4JLOhhwG0nD1EH-WOMhI9bGzJF_FGX7_UTVSqoQVp1DvIaExlV4UO7BevG9FGLsQfH9CBriKMhxANNTcrPEidV2PBrfQ9c2q3AK2yU--dxnPMt4ejCMo66hjTZiHkSNUD8FEqMB-8w71w6UCHkVXkrMlpOo9Ywwm4_wqb7x8I5jiEo4LQC0HJrdQYb3mEFZO8JFc4jfUrf8cZmuFvWBHN0RSDKzkINhhOElBpe8mHPTFeHK0sIR09gN49aIXmSTF9cPQ'

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
				this.router.navigate(['/manager']);
				return token;
			}),
			catchError((error) => {
				return throwError(() => new Error('Login failed'));
			})
		);
	}

	private setToken(token: string): void {
		localStorage.setItem('Authorization', token);
	}

	//TODO: Solução temporária para teste em ambiente Vercel
	getToken(): string | null {
		if (typeof localStorage !== 'undefined') {
			return localStorage.getItem('Authorization');
		}
		return TOKEN_DEFAULT_TEMP;
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
