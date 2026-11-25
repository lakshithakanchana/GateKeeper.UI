import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../models/login.class';
import { Observable, Subject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators'
import { Jwt } from '../models/jwt.class';
import { GateKeeperUrls } from '../models/gatekeeperurls.class';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginStatus: Subject<boolean>;
  private roles: string[] | null = null;

  constructor(private http: HttpClient) {
    this.loginStatus = new Subject<boolean>();
  }

  login(model: Login): Observable<Jwt> {
    return this.http.post<Jwt>(GateKeeperUrls.loginUrl, model)
    .pipe(
      tap(
        (res) => {
          this.setSession(res);
        }
      ),
      shareReplay(1)
    );
  }

  private setSession(authResult: Jwt): void {
    localStorage.setItem('jwt_token', authResult.token);
    localStorage.setItem("jwt_expiration", authResult.expiration);
    localStorage.setItem("jwt_user", authResult.user);
    localStorage.setItem("jwt_roles", JSON.stringify(authResult.roles));
    this.emitLoginStatus();
  }

  logout(): void {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("jwt_expiration");
    localStorage.removeItem("jwt_user");
    localStorage.removeItem("jwt_roles");
    this.roles = null;
    this.emitLoginStatus();
  }

  public isLoggedIn(): boolean {
    return (new Date()) < this.getExpiration();
  }

  public isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  public getLoginStatus(): Subject<boolean> {
    return this.loginStatus;
  }

  public emitLoginStatus(): void {
    this.loginStatus.next(this.isLoggedIn());
  }

  public haveThisRole(role: string): boolean {
    let roles = this.getRoles();
    if(roles === null)
      return false;
    return roles.includes(role);
  }

  getToken(): string | null {
    const token = localStorage.getItem("jwt_token");
    if(token === null)
      return null;
    return token;
  }

  getExpiration(): Date {
    const expiration = localStorage.getItem("jwt_expiration");
    if(expiration === null)
      return new Date("1993-01-01");
    return new Date(expiration);
  }

  getUser(): string | null {
    const user = localStorage.getItem("jwt_user");
    if(user === null)
      return null;
    return user;
  }

  getRoles(): string[] | null {
    const rolesTxt = localStorage.getItem("jwt_roles");
    if(rolesTxt === null)
      return null;
    if(this.roles === null)
      this.roles = JSON.parse(rolesTxt);
    return this.roles;
  }

}
