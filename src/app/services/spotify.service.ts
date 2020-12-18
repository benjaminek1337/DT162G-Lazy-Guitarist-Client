import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {


  url:string = environment.spotifyApiUrl;
  
  constructor(private http:HttpClient) { }

  getTracks(query) {
    return this.http.get<any>(this.url + "track=" + query);
  }

  getTrackByUri(query){
    return this.http.get<any>(this.url + "trackUri=" + query);
  }

  getAuthenticated(redirectUrl){
    window.location.href = this.url + "auth?url=" + redirectUrl;
  }

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
