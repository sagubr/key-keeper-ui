import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
	selector: '[appMaxWidth]',
	standalone: true
})
export class MaxWidthDirective implements OnInit {

	@Input('maxWidth') maxWidth: string = '20px';

	constructor(private el: ElementRef, private renderer: Renderer2) {
	}

	ngOnInit(): void {
		this.renderer.setStyle(this.el.nativeElement, 'max-width', this.maxWidth);
	}

}
