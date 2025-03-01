import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { CustomConfiguration } from '@openapi/configuration/custom-configuration';
import { Configuration as GRClientConfiguration } from '@openapi/configuration';
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { CustomPaginatorIntl } from "@app/shared/material-locale-pt";
import { httpAuthErrorsInterceptor } from "@app/core/interceptors/authentication.interceptor";

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideClientHydration(withEventReplay()),
		provideAnimationsAsync(),
		provideHttpClient(
			withFetch(),
			withInterceptors([httpAuthErrorsInterceptor])
		),
		{ provide: GRClientConfiguration, useClass: CustomConfiguration },
		{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
		{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
	]
};



