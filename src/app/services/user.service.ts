import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient, private cookieService:CookieService) { }
  
  url:string = "http://localhost:3000/api/user"
  //@Output() user_auth_string: EventEmitter<string> = new EventEmitter();

  private isLoggedIn: Subject<boolean> = new ReplaySubject<boolean>(1);

  loginStatusChange():Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  registerUser(form) {
    this.isLoggedIn.next(true);
    return this.http.post<any>(this.url + "/register", form, {withCredentials: true});
  }

  getUser(){
    return this.http.get<any>(this.url + "/getuser", {withCredentials: true});
  }

  logout(){
    this.isLoggedIn.next(false);
    return this.http.post<any>(this.url + "/logout", {withCredentials: true});
  }

  loginUser(form) {
    return this.http.post<any>(this.url + "/login", form, {withCredentials: true});
  }

  loginFailed(){
    this.isLoggedIn.next(false);
  }

  loginSuccess(){
    this.isLoggedIn.next(true);
  }

}
