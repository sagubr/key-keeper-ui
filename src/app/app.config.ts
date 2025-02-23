import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { CustomConfiguration } from '@openapi/configuration/custom-configuration';
import { Configuration as GRClientConfiguration } from '@openapi/configuration';
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideClientHydration(withEventReplay()),
		provideAnimationsAsync(),
		provideHttpClient(withFetch()),
		{ provide: GRClientConfiguration, useClass: CustomConfiguration },
		{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
		{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { width: '540px' } }
	]
};



