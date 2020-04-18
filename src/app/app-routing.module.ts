import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { CongratsComponent } from './components/congrats/congrats.component';
import { UnfinishedGuard } from './guards/unfinished.guard';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: ':id/lobby',
    component: LobbyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/board',
    component: BoardComponent,
    canActivate: [AuthGuard, UnfinishedGuard]
  },
  {
    path: ':id/congrats',
    component: CongratsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
