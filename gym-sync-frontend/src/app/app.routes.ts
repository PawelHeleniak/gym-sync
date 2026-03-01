import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

import { UserLayout } from './layout/user-layout/user-layout';
import { HomePanel } from './features/user/home-panel/home-panel';
import { TrainingPlanBuilder } from './features/user/training-plan-builder/training-plan-builder';
import { TrainingSession } from './features/user/training-session/training-session';
import { TrainingReport } from './features/user/training-report/training-report';
import { Settings } from './features/user/settings/settings';

import { AuthLayout } from './layout/auth-layout/auth-layout';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { VerifyAccount } from './features/auth/verify-account/verify-account';

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
      { path: 'ustawienia', component: Settings },
    ],
  },
  {
    path: 'autoryzacja',
    component: AuthLayout,
  },
  {
    path: 'autoryzacja/reset-hasla',
    component: ForgotPassword,
  },
  {
    path: 'autoryzacja/weryfikacja-konta',
    component: VerifyAccount,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
