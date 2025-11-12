import { Routes } from '@angular/router';
import { Main } from './layout/user-layout/main/main';
import { UserLayout } from './layout/user-layout/user-layout';
import { TrainingSession } from './features/user/training-session/training-session';
import { TrainingReport } from './features/user/training-report/training-report';
import { TrainingPlanBuilder } from './features/user/training-plan-builder/training-plan-builder';
import { HomePanel } from './features/user/home-panel/home-panel';

export const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      // { path: 'panel', component: HomePanel },
      { path: '', redirectTo: 'kreator-planu', pathMatch: 'full' },
      { path: 'kreator-planu', component: TrainingPlanBuilder },
      { path: 'trening', component: TrainingSession },
      { path: 'raport', component: TrainingReport },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
