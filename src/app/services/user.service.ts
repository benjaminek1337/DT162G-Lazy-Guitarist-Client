import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { DbTrack } from '../models/DbTrack';
import { DbSavedTrack } from '../models/DbSavedTrack';
import { DbLikedTrack } from '../models/DbLikedTrack';
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient, private cookieService:CookieService) { }
  url:string = environment.userApiUrl;

  private isLoggedIn: Subject<boolean> = new ReplaySubject<boolean>(1);
  private username: Subject<string> = new ReplaySubject<string>(1);

  loginStatusChange():Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  usernameStatusChange():Observable<string> {
    return this.username.asObservable();
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

  usernameChanged(username:string){
    this.username.next(username);
  }

  changePassword(form){
    return this.http.put(this.url + "/changepassword", form, {withCredentials: true, responseType: "text"});
  }

  changeCredentials(form){
    return this.http.put(this.url + "/changecredentials", form, {withCredentials: true, responseType: "text"});
  }

  deleteUser(){
    this.isLoggedIn.next(false);
    return this.http.delete(this.url + "/deleteuser", {withCredentials: true})
  }

  saveTrack(body){
    return this.http.post(this.url + "/savetrack", body,  {withCredentials: true, responseType: "text"});
  }

  rateTrack(body){
    return this.http.put(this.url + "/ratetrack", body,  {withCredentials: true, responseType: "text"});
  }

  setProgression(body){
    return this.http.put(this.url + "/progression", body,  {withCredentials: true, responseType: "text"});
  }

  deleteSavedTrack(trackId:string){
    return this.http.delete(this.url + "/savedtrack/" + trackId,  {withCredentials: true, responseType: "text"});
  }

  getTrack(trackId:string){
    return this.http.get<DbTrack>(this.url + "/track=" + trackId);
  }

  getSavedTrack(trackId:string){
    return this.http.get<DbSavedTrack>(this.url + "/savedtrack=" + trackId, {withCredentials: true});
  }

  getLikedTrack(trackId:string){
    return this.http.get<DbLikedTrack>(this.url + "/likedtrack=" + trackId, {withCredentials: true});
  }

  getUserTracks():Observable<any[]>{
    return this.http.get<any[]>(this.url + "/savedtracks", {withCredentials: true});
  }

}
