import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authSvc: AuthService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const jwtToken = this.authSvc.getToken(); //localStorage.getItem("id_token");

    if (jwtToken) {
      const cloned = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + jwtToken)
      });
      return next.handle(cloned);
    }
    else {
        return next.handle(request);
    }

  }
}
