import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { SidebarItems } from './sidebar.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router);

  handleLogOut() {
    localStorage.removeItem('user');
    this.router.navigate(['/autoryzacja']);
  }

  sidebarItems: SidebarItems[] = [
    {
      link: '/panel',
      active: false,
      ariaLabel: 'Panel główny',
      icon: 'fa-regular fa-house',
    },
    {
      link: '/kreator-planu',
      active: false,
      ariaLabel: 'Kreator planu',
      icon: 'fa-regular fa-calendar-plus',
    },
    {
      link: '/trening',
      active: false,
      ariaLabel: 'Trening',
      icon: 'fa-solid fa-dumbbell',
    },
    {
      link: '/raport',
      active: false,
      ariaLabel: 'Raport',
      icon: 'fa-regular fa-calendar-check',
    },
    {
      link: '/stoper',
      active: false,
      ariaLabel: 'Stoper',
      icon: 'fa-solid fa-stopwatch',
    },
    {
      link: '/ustawienia',
      active: false,
      ariaLabel: 'Ustawienia',
      icon: 'fa-solid fa-gear',
    },
  ];
}
