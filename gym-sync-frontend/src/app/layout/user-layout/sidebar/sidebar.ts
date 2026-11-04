import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';

import { SidebarItems } from './sidebar.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideDynamicIcon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router);

  handleLogOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/autoryzacja']);
  }

  sidebarItems: SidebarItems[] = [
    {
      link: '/panel',
      active: false,
      ariaLabel: 'Panel główny',
      icon: 'house',
    },
    {
      link: '/kreator-planu',
      active: false,
      ariaLabel: 'Kreator planu',
      icon: 'calendar-plus',
    },
    {
      link: '/trening',
      active: false,
      ariaLabel: 'Trening',
      icon: 'dumbbell',
    },
    {
      link: '/raport',
      active: false,
      ariaLabel: 'Raport',
      icon: 'rotate-ccw-clock',
    },
    {
      link: '/stoper',
      active: false,
      ariaLabel: 'Stoper',
      icon: 'timer',
    },
    // {
    //   link: '/ustawienia',
    //   active: false,
    //   ariaLabel: 'Ustawienia',
    //   icon: 'settings',
    // },
  ];
}
