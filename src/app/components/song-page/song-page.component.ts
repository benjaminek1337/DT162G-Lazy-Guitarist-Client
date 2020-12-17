import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/models/Track';
import { ActivatedRoute, Router } from "@angular/router";
import { SpotifyService } from "../../services/spotify.service";
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user.service';
import { DbTrack } from 'src/app/models/DbTrack';
import { DbSavedTrack } from 'src/app/models/DbSavedTrack';
import { DbLikedTrack } from 'src/app/models/DbLikedTrack';

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

  dbTrack:DbTrack;
  dbSavedTrack:DbSavedTrack;

  isTrackSaved:boolean;
  likeBtnDisabled:boolean;
  dislikeBtnDisabled:boolean;
  
  // TODO - försöka passa in songdata från search genom routes. ActivatedRoute = manage states. FUGG svårare än tänkt. spara till sen
  // TODO - Försöka få till ETT försök till auteneicering automatiskt

  ngOnInit(): void {
    this.isLoggedIn = this.cookieService.check("sid");
    
    this.mySubscription = this.userservice.loginStatusChange().subscribe(s => {
      this.isLoggedIn = s;
    });

    this.getSpotifyTrack();
    
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

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
      this.getTrackdataFromDb();
    })
    this.authenticate();
  }

  async getTrackdataFromDb(){
    this.userservice.getTrack(this.track.id).subscribe(t => {
      if(t)
        this.dbTrack = t;
    }, err => {
      console.log("Spår finns ej i db");
    });
    this.userservice.getSavedTrack(this.track.id).subscribe(t => {
      if(t){
        this.dbSavedTrack = t;
        this.isTrackSaved = t.saved;
        this.dislikeBtnDisabled = t.disliked;
        this.likeBtnDisabled = t.liked;
      } else {
        this.isTrackSaved = false;
        this.dislikeBtnDisabled = false;
        this.likeBtnDisabled = false;
      }
    }, err => {
      console.log("Spår finns ej i db");
    });
  }

  isLikeBtnDisabled(){
    if(!this.dbSavedTrack)
      return this.likeBtnDisabled = false;
    return this.likeBtnDisabled =  this.dbSavedTrack.liked;
  }

  isDislikeBtnDisabled(){
    if(!this.dbSavedTrack)
      return this.dislikeBtnDisabled = false;
      return this.dislikeBtnDisabled =  this.dbSavedTrack.disliked;
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

  saveTrack(){
    const track = { 
      trackId: this.track.id,
      track: this.track.title,
      artist: this.track.artist,
      album: this.track.album
    };
    this.userservice.saveTrack(track).subscribe(t => {
      console.log(t);
      this.isTrackSaved = true;
    }, err => {
      console.log(err);
    })
  }

  setProgression(progress:string){
    const body = {
      trackId: this.track.id,
      progress: progress
    };
    this.userservice.setProgression(body).subscribe(s => {
      console.log(s);
    }, err => {
      console.log(err);
    })
  }

  rate(liked:string){
    const body = { 
      trackId: this.track.id,
      liked: (liked == "liked") ? true : false,
      disliked: (liked == "liked") ? false : true,
      track: this.track.title,
      artist: this.track.artist,
      album: this.track.album
    }
    this.userservice.rateTrack(body).subscribe(s => {
      this.dislikeBtnDisabled = (s == "false") ? true : false;
      this.likeBtnDisabled = (s == "true") ? true : false;
      this.userservice.getTrack(this.track.id).subscribe(t => {
        this.dbTrack = t;
      }, err => {
        console.log("Något hände vid rating")
      })
    }, err => {
      console.log(err);
    })
  }

  ultimateGuitarSearch():void{
    window.open("https://www.ultimate-guitar.com/search.php?search_type=title&value=" + this.track.title + " " + this.track.artist, "_blank");
  }
}
