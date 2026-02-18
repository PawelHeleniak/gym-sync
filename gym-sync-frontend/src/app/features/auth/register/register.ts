import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  @Output() view = new EventEmitter<'login'>();

  handleLogin() {
    this.view.emit('login');
  }
}
