import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { SelectCountryDirective } from './directives/select-country.directive';
import { ArmyComponent } from './components/board/army/army.component';
import { TurnActionsComponent } from './components/board/turn-actions/turn-actions.component';
import { CardsComponent } from './components/board/cards/cards.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { LobbyComponent } from './components/lobby/lobby.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { CongratsComponent } from './components/congrats/congrats.component';
import { CardItemComponent } from './components/board/cards/card-item/card-item.component';
import { SelectionsComponent } from './components/board/selections/selections.component';
import { AvoidNullPipe } from './pipes/avoid-null.pipe';
import { DicesComponent } from './components/board/dices/dices.component';
import { AvailableArmiesComponent } from './components/board/available-armies/available-armies.component';
import { TurnOrderComponent } from './components/board/turn-order/turn-order.component';
import { GoalComponent } from './components/board/goal/goal.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SelectCountryDirective,
    ArmyComponent,
    TurnActionsComponent,
    CardsComponent,
    LobbyComponent,
    LoginComponent,
    HomeComponent,
    CongratsComponent,
    CardItemComponent,
    SelectionsComponent,
    AvoidNullPipe,
    DicesComponent,
    AvailableArmiesComponent,
    TurnOrderComponent,
    GoalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    NgZorroAntdModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
