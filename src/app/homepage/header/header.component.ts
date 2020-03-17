import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSub: Subscription;
  isUserAuthenticated = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        // Find out users authentication status to update the
        // links in the header
        this.isUserAuthenticated = isAuthenticated;
      })
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
