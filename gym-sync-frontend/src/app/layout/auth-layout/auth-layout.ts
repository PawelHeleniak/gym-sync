import { Component } from '@angular/core';
import { Login } from '../../features/auth/login/login';
import { Register } from '../../features/auth/register/register';
import { Input } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  imports: [Login, Register],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  view: 'login' | 'register' = 'login';

  handleView(page: 'login' | 'register') {
    this.view = page;
  }
}
