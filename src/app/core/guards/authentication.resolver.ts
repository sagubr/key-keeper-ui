import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from "@app/core/services/authentication.service";


@Injectable({
	providedIn: 'root'
})
export class AuthenticationResolver implements Resolve<boolean> {

	constructor(
		private authentication: AuthenticationService,
		private router: Router
	) {
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if (this.authentication.isAuthenticated()) {
			return true;
		}
		//this.router.navigate(['/login']);
		return false;
	}
}
