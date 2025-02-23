import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from "@app/core/services/authentication.service";

@Injectable({
	providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
	constructor(private router: Router, private auth: AuthenticationService) {
	}

	canActivate(): boolean {
		console.log(this.auth.isAuthenticated())
		if (this.auth.isAuthenticated()) {
			return true;
		} else {
			this.router.navigate(['/login']);
			return false;
		}
	}
}
