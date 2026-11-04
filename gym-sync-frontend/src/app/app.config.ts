import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideLucideIcons,
  LucideHouse,
  LucideCalendarPlus,
  LucideDumbbell,
  LucideSettings,
  LucideRotateCcwClock,
  LucideTimer,
  LucideLogOut,
  LucideClock4,
  LucideTrendingUp,
  LucideListCheck,
  LucideWeight,
  LucideHourglass,
  LucideCalendarCheck,
} from '@lucide/angular';
import { routes } from './app.routes';

import { userInterceptor } from './core/interceptors/user.intercepror';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([userInterceptor])),
    provideLucideIcons(
      LucideHouse,
      LucideCalendarPlus,
      LucideDumbbell,
      LucideSettings,
      LucideRotateCcwClock,
      LucideTimer,
      LucideLogOut,
      LucideClock4,
      LucideTrendingUp,
      LucideListCheck,
      LucideWeight,
      LucideHourglass,
      LucideCalendarCheck,
    ),
  ],
};
