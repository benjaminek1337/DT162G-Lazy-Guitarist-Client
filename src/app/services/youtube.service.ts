import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "../../environments/environment"


@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  constructor(private http:HttpClient) { }
  url:string = environment.youtubeApiUrl;

  // Hämta data över youtubevideor baserat på söksträng
  getVideo(query:string){
    return this.http.get<any>(this.url + "/search=" + query);
  }
}
