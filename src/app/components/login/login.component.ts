import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorsSummary } from 'src/app/models/errors-summary.class';
import { Login } from 'src/app/models/login.class';
import { AuthService } from 'src/app/services/auth.service';
import { CustomFormValidatorsService } from 'src/app/services/custom-form-validators.service';
import { HttpErrorHandlerService } from 'src/app/services/http-error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  loginForm: FormGroup;
  hidePass = true;
  loginSubscription: Subscription | null = null;
  errorsSummary: ErrorsSummary | null = null;
  loading: boolean = false;

  constructor(public cFValidatorsSvc: CustomFormValidatorsService, private authService: AuthService,
    private httpErrorHandelerSvc: HttpErrorHandlerService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, this.cFValidatorsSvc.noWhiteSpacesAllowed]),
      password: new FormControl('', Validators.required)
    });
  }

  onLogInClick(): void {

    const model: Login = this.loginForm.value;
    if (model.username && model.password) {

      this.loading = true;

      if(this.loginSubscription !== null)
        this.loginSubscription.unsubscribe();

      setTimeout(() => {
        this.loginSubscription = this.authService.login(model)
        .subscribe({
          next: () => {
            this.errorsSummary = null;
            this.loading = false;
            this.router.navigateByUrl('/Home');
          },
          error: (error: HttpErrorResponse) => {
            this.errorsSummary = this.httpErrorHandelerSvc.handle(error);
            this.loading = false;
          }
        });
      }, 1600);

    } // End of if(this.model each val !== null)

  } // End of onLogInClick()

  ngOnDestroy(): void {
    if(this.loginSubscription !== null)
      this.loginSubscription.unsubscribe();
  }

}
