import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ArmiesToAdd } from 'src/app/models/armies-to-add.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import { Turn } from 'src/app/models/turn.model';

@Component({
  selector: 'app-available-armies',
  templateUrl: './available-armies.component.html',
  styleUrls: ['./available-armies.component.scss']
})
export class AvailableArmiesComponent implements OnInit {


  @Input() turn: Turn;

  constructor(
  ) { }

  ngOnInit(): void {

  }

}
