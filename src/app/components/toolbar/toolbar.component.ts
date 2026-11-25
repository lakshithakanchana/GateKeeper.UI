import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @Output()
  menuButtonClick: EventEmitter<boolean>
  loginStatus: boolean = false;
  user:string | null = '';
  loginStatusSubscription: Subscription | null = null;
  breakpointObserrverSubscription: Subscription | null = null;
  compressToolbar: boolean = false;

  constructor(private authSvc: AuthService, private router: Router, private breakpointObserrver: BreakpointObserver) {
    this.menuButtonClick = new EventEmitter();
  }

  ngOnInit(): void {

    if(this.loginStatusSubscription !== null)
      this.loginStatusSubscription.unsubscribe();

    this.loginStatusSubscription = this.authSvc
      .getLoginStatus()
      .subscribe(
        (emittedVal) => {
          this.loginStatus = emittedVal
          this.user = this.authSvc.getUser();
        }
      );
    this.authSvc.emitLoginStatus();

    this.breakpointObserrverSubscription = this.breakpointObserrver.observe('(max-width: 450px)')
    .subscribe(result => {
      if(result.matches)
        this.compressToolbar = true;
      else
        this.compressToolbar = false;
    });
  }

  onMenuButtonClick(): void {
    this.menuButtonClick.emit(true);
  }

  onLoginLogoutButtonClick(): void {
    if(this.loginStatus)
      this.authSvc.logout();
    // redirect to login page
    this.router.navigateByUrl('/Login');
  }

  ngOnDestroy(): void {
    if(this.loginStatusSubscription !== null)
      this.loginStatusSubscription.unsubscribe();
  }

}
