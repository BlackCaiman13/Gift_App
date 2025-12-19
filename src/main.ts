import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { jwtInterceptor } from './app/core/interceptors/jwt.interceptor';
import { authGuard } from './app/core/guards/auth.guard';
import { loginGuard } from './app/core/guards/login.guard';
import { LoginComponent } from './app/features/login/login.component';
import { DashboardComponent } from './app/features/dashboard/dashboard.component';
import { ParticipantsComponent } from './app/features/participants/participants.component';
import { GiftsComponent } from './app/features/gifts/gifts.component';
import { DrawComponent } from './app/features/draw/draw.component';
import { ResultsComponent } from './app/features/results/results.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'participants', component: ParticipantsComponent, canActivate: [authGuard] },
  { path: 'gifts', component: GiftsComponent, canActivate: [authGuard] },
  { path: 'draw', component: DrawComponent, canActivate: [authGuard] },
  { path: 'results', component: ResultsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimations()
  ]
});
