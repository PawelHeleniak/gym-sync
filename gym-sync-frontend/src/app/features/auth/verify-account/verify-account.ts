import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-verify-account',
  imports: [RouterModule],
  templateUrl: './verify-account.html',
  styleUrl: './verify-account.scss',
})
export class VerifyAccount {
  private route = inject(ActivatedRoute);
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');

      if (token) this.authService.confirmAccount(token).subscribe();
    });
  }
}
