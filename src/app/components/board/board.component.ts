import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { map, filter, tap } from 'rxjs/operators';
import { Player } from 'src/app/models/player.model';
import { Observable, combineLatest } from 'rxjs';
import { TurnService } from 'src/app/services/turn.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, AfterViewInit {

  countriesMapped = [];
  @ViewChildren('country') countries: QueryList<ElementRef>;

  game$ = this.gameService.game$;
  players$: Observable<Player[]>;

  firstSelectedCountry$ = this.mapService.firstSelectedCountry$;
  secondSelectedCountry$ = this.mapService.secondSelectedCountry$;

  constructor(
    private cd: ChangeDetectorRef,
    private gameService: GameService,
    private turnService: TurnService,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.players$ = this.gameService.game$.pipe(
      map(game => game.players),
    );
  }

  ngAfterViewInit() {
    this.addListenersToCountries();
    this.setListenerMapCountriesInfoToBoard();
    this.triggerChanges();
  }

  addListenersToCountries = () => {
    this.countries.forEach(ref => {
      ref.nativeElement.addEventListener('click', () => this.handleCountryClick(ref.nativeElement.id));
    });
  }

  handleCountryClick = (country) => {
    this.mapService.selectCountry(country);
  }

  setListenerMapCountriesInfoToBoard = () => {
    combineLatest([this.players$, this.countries.changes]).pipe(
      filter(([players, countriesRef]) => players && countriesRef)
    ).subscribe(([players, countriesRef]) => {
      this.countriesMapped = [];
      countriesRef.forEach(countryRef => {
        const countryName = countryRef.nativeElement.id;
        players.forEach(p => {
          const countryIdx = p.countries.findIndex(c => c.name === countryName);
          if (countryIdx !== -1) {
            const country = p.countries[countryIdx];
            this.countriesMapped.push({
              ref: countryRef,
              armies: country.armies,
              color: p.color
            });

          }
        });
      });
    });
  }

  triggerChanges = () => {
    this.countries.notifyOnChanges();
    this.cd.detectChanges();
  }

  onClicked = () => alert('clicked');
}
