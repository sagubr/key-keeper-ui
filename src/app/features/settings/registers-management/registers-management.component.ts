import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoggingService } from "@openapi/api/logging.service";
import { EventLoggingEvent } from "@openapi/model/eventLoggingEvent";
import { HttpEvent, HttpEventType, HttpResponse } from "@angular/common/http";
import * as console from "node:console";
import { Subscription } from "rxjs";
import { EventStreamService } from "@app/core/services/event-stream.service";

@Component({
	selector: 'app-registers-management',
	imports: [],
	templateUrl: './registers-management.component.html',
	styleUrl: './registers-management.component.scss'
})
export class RegistersManagementComponent implements OnInit, OnDestroy {
	private eventSubscription!: Subscription;

	constructor(private eventService: EventStreamService) {}

	eventData: any[] = [];

	ngOnInit(): void {
		this.eventSubscription = this.eventService.getSocketEvents().subscribe({
			next: (data: any) => {
				console.log('Evento recebido no subscribe:', data);
				this.eventData.push(data);
				sessionStorage.setItem('eventData', JSON.stringify(this.eventData));
			},
			error: (error: any) => {
				console.error('Erro na conexão SSE:', error);
			},
			complete: () => {
				console.log('Conexão SSE encerrada.');
			}
		});

		setTimeout(() => {
			if (!this.eventSubscription) {
				console.error('O subscribe foi cancelado antes de receber eventos!');
			}
		}, 5000);
	}

	ngOnDestroy(): void {
		if (this.eventSubscription) {
			this.eventSubscription.unsubscribe();
			console.log('Inscrição SSE cancelada.');
		}
	}

}
