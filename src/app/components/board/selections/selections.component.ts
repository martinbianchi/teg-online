import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-selections',
  templateUrl: './selections.component.html',
  styleUrls: ['./selections.component.scss']
})
export class SelectionsComponent implements OnInit {

  from$: Observable<string>;
  to$: Observable<string>;

  constructor(
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.from$ = this.mapService.firstSelectedCountry$;
    this.to$ = this.mapService.secondSelectedCountry$;
  }

}
