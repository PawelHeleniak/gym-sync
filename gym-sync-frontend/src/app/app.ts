import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'gym-sync-frontend';
  ngOnInit(): void {
    const dev = window.location.href.includes('localhost');
    if (dev) document.title = 'RepEvo - DEV';
  }
}
