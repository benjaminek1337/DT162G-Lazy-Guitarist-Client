import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/models/Track';
import { ActivatedRoute, Router } from "@angular/router";
import { SpotifyService } from "../../services/spotify.service";
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-song-page',
  templateUrl: './song-page.component.html',
  styleUrls: ['./song-page.component.css']
})
export class SongPageComponent implements OnInit {

  constructor(
    private activatedRoute:ActivatedRoute,
    private spotifyService:SpotifyService,
    private router:Router,
    private cookieService:CookieService,
    private userservice:UserService
    ) {}
    
  track:Track;
  auth_token:any;
  premiumUser:boolean;
  authenticationRefreshInterval:any;
  mySubscription:any;
  isLoggedIn: boolean;
  
  // TODO - försöka passa in songdata från search genom routes. ActivatedRoute = manage states. FUGG svårare än tänkt. spara till sen
  // TODO - Försöka få till ETT försök till auteneicering automatiskt

  ngOnInit(): void {
    this.isLoggedIn = this.cookieService.check("sid");
    
    this.mySubscription = this.userservice.loginStatusChange().subscribe(s => {
      this.isLoggedIn = s;
      console.log(this.isLoggedIn);
    });

    let id = this.activatedRoute.snapshot.paramMap.get("id");
    this.spotifyService.getTrackByUri(id).subscribe(t => {
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

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

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

  cutOffUnwantedSongTitleParts():void{
    const splitTitle = this.track.title.split("-");
    const naughtyWords = ["remastered", "remaster"]
    this.track.title = "";
    for (let i = 0; i < splitTitle.length; i++) {
      if(!this.contains(splitTitle[i].toLocaleLowerCase(), naughtyWords)){
        this.track.title += splitTitle[i];
      }
    }
  }

  contains(target, pattern):boolean{
    for (let i = 0; i < pattern.length; i++) {
      const element = pattern[i];
      if(target.includes(element))
        return true;
    }
    return false;
  }

  authenticate():void{
    if(this.cookieService.check("access_token")){
      this.auth_token = this.cookieService.get("access_token");
      this.isPremiumUser();
      this.authenticationRefreshInterval = setInterval(() => {
        this.authenticate();
      }, 3550000)
    } else {
      clearInterval(this.authenticationRefreshInterval);
      console.log("Authentication Token Not Found")
    }
  }

  isPremiumUser():void{
    this.spotifyService.getCurrentUser(this.auth_token).subscribe(u => {
      if(u.product == "premium")
        this.premiumUser = true;
    });
  }

  ultimateGuitarSearch():void{
    window.open("https://www.ultimate-guitar.com/search.php?search_type=title&value=" + this.track.title + " " + this.track.artist, "_blank");
  }
}
