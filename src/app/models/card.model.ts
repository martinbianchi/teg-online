import { Country } from './country.model';
import { CardSymbolEnum } from './card-symbol.enum';

export interface Card {
    country: string;
    used: boolean;
    symbol: CardSymbolEnum;
}