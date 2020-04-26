import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from 'src/app/models/card.model';
import { CardSymbolEnum } from 'src/app/models/card-symbol.enum';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit {

  @Input() card: Card = {
    country: 'Argentina',
    symbol: CardSymbolEnum.JOKER,
    used: false
  };

  @Output() readonly selectCard = new EventEmitter<Card>();
  @Output() readonly unselectCard = new EventEmitter<Card>();
  @Output() readonly useCard = new EventEmitter<Card>();

  get urlToSvg() {
    return `/assets/${this.card.symbol}.svg`;
  }
  checked = false;

  constructor() { }

  ngOnInit(): void {
  }

  onUseCard = () => this.useCard.emit(this.card);

  onChange = (checked: boolean) => {
    checked
      ? this.selectCard.emit(this.card)
      : this.unselectCard.emit(this.card);
  }
}
