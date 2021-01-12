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

  // URL som ändras beroende på environment (dev eller prod)
  url:string = environment.userApiUrl;

  // Dessa ReplaySubjects subscribas till som Observables. Används för att dynamiskt uppdatera information på
  // webbplatsen

  // ReplaySubject som får värde true/false bereonde på om anv är inloggad eller ej
  private isLoggedIn: Subject<boolean> = new ReplaySubject<boolean>(1); 
  // ReplaySubject som håller koll på användarnamn
  private username: Subject<string> = new ReplaySubject<string>(1);

  // Returnerar status på isLoggedIn ReplaySubject
  loginStatusChange():Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  // Returnerar status på usernamne ReplaySubject
  usernameStatusChange():Observable<string> {
    return this.username.asObservable();
  }

  // Alla API-calls nedanför snackar med egna servern

  // Registrera ny användare
  registerUser(form) {
    this.isLoggedIn.next(true);
    return this.http.post<any>(this.url + "/register", form, {withCredentials: true});
  }

  // Hämta användare från server
  getUser(){
    return this.http.get<any>(this.url + "/getuser", {withCredentials: true});
  }

  // Logga ut användaren
  logout(){
    this.isLoggedIn.next(false);
    return this.http.post<any>(this.url + "/logout", {withCredentials: true});
  }

  // Logga in användaren
  loginUser(form) {
    return this.http.post<any>(this.url + "/login", form, {withCredentials: true});
  }

  // Ändra status på isLoggedIn till false
  loginFailed(){
    this.isLoggedIn.next(false);
  }

    // Ändra status på isLoggedIn till true
  loginSuccess(){
    this.isLoggedIn.next(true);
  }

  // Ändra värde på username ReplaySubject
  usernameChanged(username:string){
    this.username.next(username);
  }

  // Byt lösenord till användaren
  changePassword(form){
    return this.http.put(this.url + "/changepassword", form, {withCredentials: true, responseType: "text"});
  }

  // Ändra användarinformation till användaren
  changeCredentials(form){
    return this.http.put(this.url + "/changecredentials", form, {withCredentials: true, responseType: "text"});
  }

  // Ta bort användaren
  deleteUser(){
    this.isLoggedIn.next(false);
    return this.http.delete(this.url + "/deleteuser", {withCredentials: true})
  }

  // Spara ett spår till användaren
  saveTrack(body){
    return this.http.post(this.url + "/savetrack", body,  {withCredentials: true, responseType: "text"});
  }

  // Spara användarens bedömning av ett spår
  rateTrack(body){
    return this.http.put(this.url + "/ratetrack", body,  {withCredentials: true, responseType: "text"});
  }

  // Ändra användarens progression på en låt
  setProgression(body){
    return this.http.put(this.url + "/progression", body,  {withCredentials: true, responseType: "text"});
  }

  // Ta bort sparat spår för användaren
  deleteSavedTrack(trackId:string){
    return this.http.delete(this.url + "/savedtrack/" + trackId,  {withCredentials: true, responseType: "text"});
  }

  // Hämta ett spår från databasen baserat på id
  getTrack(trackId:string){
    return this.http.get<DbTrack>(this.url + "/track=" + trackId);
  }

  // Hämta data om sparat spår baserat på id
  getSavedTrack(trackId:string){
    return this.http.get<DbSavedTrack>(this.url + "/savedtrack=" + trackId, {withCredentials: true});
  }

  // Hämta data om gillat spår baserat på id
  getLikedTrack(trackId:string){
    return this.http.get<DbLikedTrack>(this.url + "/likedtrack=" + trackId, {withCredentials: true});
  }

  // Hämta användarens sparade spår
  getUserTracks():Observable<any[]>{
    return this.http.get<any[]>(this.url + "/savedtracks", {withCredentials: true});
  }

}
