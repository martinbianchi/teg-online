import { Directive, Input, ElementRef, Renderer2, HostListener, OnInit } from '@angular/core';
import { MapService } from '../services/map.service';
import { combineLatest } from 'rxjs';

@Directive({
  selector: '[appSelectCountry]'
})
export class SelectCountryDirective implements OnInit {

  elemRef: ElementRef;

  constructor(
    private renderer2: Renderer2,
    _elementRef: ElementRef,
    private mapService: MapService
  ) {
    this.elemRef = _elementRef;
  }

  ngOnInit(): void {
    combineLatest([this.mapService.firstSelectedCountry$, this.mapService.secondSelectedCountry$]).subscribe(
      ([firstSelected, secondSelected]) => {
        if (firstSelected === this.elemRef.nativeElement.id) {
          this.renderer2.addClass(this.elemRef.nativeElement, 'first-selected');
        } else {
          this.renderer2.removeClass(this.elemRef.nativeElement, 'first-selected');
        }

        if (secondSelected === this.elemRef.nativeElement.id) {
          this.renderer2.addClass(this.elemRef.nativeElement, 'second-selected');
        } else {
          this.renderer2.removeClass(this.elemRef.nativeElement, 'second-selected');
        }
      })
  }
}
