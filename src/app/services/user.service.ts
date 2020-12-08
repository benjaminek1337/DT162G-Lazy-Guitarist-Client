import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url:string = "http://localhost:3000/api/user"

  constructor(private http:HttpClient) { }

  registerUser(form) {
    return this.http.post<any>(this.url + "/register", form, {withCredentials: true});
  }

  getUser(){
    return this.http.get<any>(this.url + "/getuser", {withCredentials: true});
  }

  loginUser(form) {
    return this.http.post<any>(this.url + "/login", form, {withCredentials: true});
  }

  logout(){
    return this.http.post<any>(this.url + "/logout", {withCredentials: true});
  }
}
