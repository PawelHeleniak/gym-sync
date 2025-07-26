import { Component } from '@angular/core';
import { Sidebar } from './sidebar/sidebar';
import { Main } from './main/main';

@Component({
  selector: 'app-user-layout',
  imports: [Sidebar, Main],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.scss',
})
export class UserLayout {}
