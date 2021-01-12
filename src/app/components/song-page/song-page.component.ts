import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/models/Track';
import { ActivatedRoute, Router } from "@angular/router";
import { SpotifyService } from "../../services/spotify.service";
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user.service';
import { DbTrack } from 'src/app/models/DbTrack';
import { DbSavedTrack } from 'src/app/models/DbSavedTrack';

@Component({
  selector: 'app-song-page',
  templateUrl: './song-page.component.html',
  styleUrls: ['./song-page.component.css']
})
export class SongPageComponent implements OnInit {

  constructor(
    private activatedRoute:ActivatedRoute,
    private spotifyService:SpotifyService,
    private cookieService:CookieService,
    private userservice:UserService
    ) {}
    
  track:Track; // Objekt innehållande aktuellt spår
  auth_token:any; // Spotify autenticeringstoken
  premiumUser:boolean; // Har användaren ett spotify-premium konto?
  userSubscription:any; // Håller koll på om användaren är inloggad eller ej
  isLoggedIn: boolean; // Är användaren inloggad
  likePercentage: number; // Hur stor andel användare har gillat låten

  // Kolla om anv är inloggad, subscriba för att löpande ha koll på om användaren är inloggad eller ej
  ngOnInit(): void {
    this.isLoggedIn = this.cookieService.check("sid");
    this.userSubscription = this.userservice.loginStatusChange().subscribe(s => {
      this.isLoggedIn = s;
    });
    this.getSpotifyTrack();
  }

  // Skrota subscriptionen om användaren är inloggad för att förhindra dataläckor
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Hämta låt-info från API och fylla track-objekt med den info
  async getSpotifyTrack(){
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    await this.spotifyService.getTrackByUri(id).subscribe(t => {
      this.track = {
        id: t.id,
        title: t.name,
        album: t.album.name,
        albumcover: t.album.images[1].url,
        artist: (t.artists.length > 1) ? this.getAllArtists(t) : t.artists[0].name,
        duration: t.duration_ms
      }
      this.cutOffUnwantedSongTitleParts();
    })
    this.authenticate();
  }

  // Hämtar alla artister tillhörande låten och formatera strängen
  getAllArtists(t:any):string{
    let artists:string = "";
      for (let i = 0; i < t.artists.length; i++) {
        if(i == t.artists.length - 1){
          artists += t.artists[i].name
        } else {
          artists += t.artists[i].name + ", ";
        }
      }
    return artists;
  }

  // Ta bort ord som remastered, remaster osv. 
  cutOffUnwantedSongTitleParts():void{
    const naughtyWords = ["(remastered)", "(remaster)", "remastered", "remaster",]
    if(this.contains(this.track.title.toLocaleLowerCase(), naughtyWords)){
      const splitTitle = this.track.title.split("-");
      if(splitTitle.length > 1){
        this.track.title = "";
        for (let i = 0; i < splitTitle.length; i++) {
          if(!this.contains(splitTitle[i].toLocaleLowerCase(), naughtyWords)){
            this.track.title += splitTitle[i];
          }
        }
      } else {
        for (let i = 0; i < naughtyWords.length; i++) {
          const naughtyWord = naughtyWords[i];
          if(this.track.title.toLocaleLowerCase().includes(naughtyWord)){
            this.track.title = this.track.title.toLocaleLowerCase().replace(naughtyWord, "");
          }
        }
      }
    }
  }

  // Metod som kontrollerar om ett ord matchar ett pattern (finns "sök" i array["sök", "finna"])
  contains(target, pattern):boolean{
    for (let i = 0; i < pattern.length; i++) {
      const element = pattern[i];
      if(target.includes(element))
        return true;
    }
    return false;
  }

  // Sätt värde till propertyn likePercentage
  setLikePercentage(_likePercentage:number){
    this.likePercentage = Math.round(_likePercentage);
  }

  // Spotify-autenticera användaren
  authenticate():void{
    if(this.cookieService.check("access_token")){
      this.auth_token = this.cookieService.get("access_token");
      this.isPremiumUser();
    } else {
      console.log("Authentication Token Not Found")
    }
  }

  // Kontrollera om användaren har ett Spotify-premium konto
  isPremiumUser():void{
    this.spotifyService.getCurrentUser(this.auth_token).subscribe(u => {
      if(u.product == "premium")
        this.premiumUser = true;
    });
  }

  // Ta bort vissa specialtecken från sträng
  stripUnwantedCharactersFromString(subject:string){
    let output:string = "";
    for (let i = 0; i < subject.length; i++) {
      const element = subject[i];
      if((/[a-öA-Ö0-9 ()]/).test(element)){
        output += element;
      }
    }
    return output;
  }

  // Skapa söksträng till Ultimate Guitars url och öppna i nytt fönster
  ultimateGuitarSearch():void{
    window.open("https://www.ultimate-guitar.com/search.php?search_type=title&value=" 
    + this.stripUnwantedCharactersFromString(this.track.title) + " " 
    + this.stripUnwantedCharactersFromString(this.track.artist), "_blank");
  }
}
