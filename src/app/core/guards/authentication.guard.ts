import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { map } from "rxjs/operators";

@Injectable({
	providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {

	constructor(
		private readonly authentication: AuthenticationService,
		private readonly router: Router
	) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.authentication.isAuthenticated().pipe(
			map((isAuthenticated) => {
				if (!isAuthenticated) {
					this.router.navigate(['/login']);
					return false;
				}
				return true;
			})
		);
	}

}
