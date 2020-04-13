import { Component, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-army',
  templateUrl: './army.component.html',
  styleUrls: ['./army.component.scss']
})
export class ArmyComponent implements OnInit {

  @Input() elemRef: ElementRef;
  @Input() armies = 1;
  @Input() color: string;

  topPos = 0;
  leftPos = 0;

  constructor(
    private renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    const boundaries: BoundingPath = this.elemRef?.nativeElement.getBoundingClientRect();
    this.topPos = boundaries.top + (boundaries.height / 2) - 10;
    this.leftPos = boundaries.left + (boundaries.width / 2) - 10;
  }

}

export interface BoundingPath {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  left: number;
  bottom: number;
}
