import { Routes } from '@angular/router';
import { Main } from './layout/user-layout/main/main';
import { UserLayout } from './layout/user-layout/user-layout';
import { TrainingSession } from './features/user/training-session/training-session';
import { TrainingReport } from './features/user/training-report/training-report';
import { TrainingPlanBuilder } from './features/user/training-plan-builder/training-plan-builder';
import { HomePanel } from './features/user/home-panel/home-panel';
import { authGuard } from './core/guards/auth-guard';

import { AuthLayout } from './layout/auth-layout/auth-layout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'panel', pathMatch: 'full' },
      { path: 'panel', component: HomePanel },
      { path: 'kreator-planu', component: TrainingPlanBuilder },
      { path: 'trening', component: TrainingSession },
      { path: 'raport', component: TrainingReport },
    ],
  },
  {
    path: 'autoryzacja',
    component: AuthLayout,
    // children: [
    //   { path: '', redirectTo: 'logowanie', pathMatch: 'full' },
    //   { path: 'logowanie', component: Login },
    //   { path: 'rejestracja', component: Register },
    // ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
