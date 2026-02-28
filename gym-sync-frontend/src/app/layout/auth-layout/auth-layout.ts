import { Component } from '@angular/core';
import { Login } from '../../features/auth/login/login';
import { Register } from '../../features/auth/register/register';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  imports: [Login, Register, CommonModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  view: 'login' | 'register' = 'login';
  viewDelay: 'login' | 'register' = 'login';
  isAnimating: boolean = false;

  private mediaQuery = window.matchMedia('(max-width: 768px)');
  isMobile = this.mediaQuery.matches;

  ngOnInit() {
    this.mediaQuery.addEventListener('change', (e) => {
      this.isMobile = e.matches;
    });
  }
  handleView(page: 'login' | 'register') {
    if (this.isAnimating) return;

    this.view = page;
    this.isAnimating = true;

    setTimeout(() => {
      this.viewDelay = page;
      this.isAnimating = false;
    }, 600);
  }
  get currentView() {
    return this.isMobile ? this.view : this.viewDelay;
  }
}
