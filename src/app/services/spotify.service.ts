import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {


  // URL-sträng till APIet, ändras baserad på environment (prod eller dev)
  url:string = environment.spotifyApiUrl;
  
  constructor(private http:HttpClient) { }

  // Alla av dessa snackar med egetskapat API

  // Hämta spår från söksträng fritext
  getTracks(query) {
    return this.http.get<any>(this.url + "track=" + query);
  }

  // Hämta spår från Id
  getTrackByUri(query){
    return this.http.get<any>(this.url + "trackUri=" + query);
  }

  // Hämta spellistor
  getPlaylists(){
    return this.http.get<any>(this.url + "db-playlists");
  }

  // Hämta spellista med Id
  getPlaylistById(id: string){
    return this.http.get<any>(this.url + "playlist=" + id);
  }

  // Autenticera användares spotify-konto
  getAuthenticated(redirectUrl){
    window.location.href = this.url + "auth?url=" + redirectUrl;
  }

  // Hämta användarens spotify-token
  getCurrentUser(token){
    const headerDict = {
      "Authorization": "Bearer " + token
    }
    const header = {
      headers: new HttpHeaders(headerDict)
    }
    return this.http.get<any>("https://api.spotify.com/v1/me", header);
  }
}
