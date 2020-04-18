import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { map, filter, tap } from 'rxjs/operators';
import { Player } from 'src/app/models/player.model';
import { Observable, combineLatest } from 'rxjs';
import { TurnService } from 'src/app/services/turn.service';
import { MapService } from 'src/app/services/map.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Game } from 'src/app/models/game.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: []
})
export class BoardComponent implements OnInit, AfterViewInit {

  countriesMapped = [];
  @ViewChildren('country') countries: QueryList<ElementRef>;

  players$: Observable<Player[]>;

  firstSelectedCountry$ = this.mapService.firstSelectedCountry$;
  secondSelectedCountry$ = this.mapService.secondSelectedCountry$;

  constructor(
    private cd: ChangeDetectorRef,
    private mapService: MapService,
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    const key = this.route.snapshot.params['id'];
    this.players$ = this.firebaseService.getGame(key).pipe(
      tap(g => this.checkWinner(g)),
      map(game => game.players),
    );
    // this.gameService.getGamee(key).subscribe();
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
          if (p.countries) {
            const countryIdx = p.countries.findIndex(c => c.name === countryName);
            if (countryIdx !== -1) {
              const country = p.countries[countryIdx];
              this.countriesMapped.push({
                ref: countryRef,
                armies: country.armies,
                color: p.color
              });

            }
          }
        });
      });
    });
  }

  triggerChanges = () => {
    this.countries.notifyOnChanges();
    this.cd.detectChanges();
  }

  checkWinner = (game: Game) => {
    if (game.finished) {
      this.router.navigate(['../congrats'], { relativeTo: this.route });
    }
  }

  onClicked = () => alert('clicked');
}
