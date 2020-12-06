import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/models/Track';
import { ActivatedRoute } from "@angular/router"
import { SpotifyService } from "../../services/spotify.service"

@Component({
  selector: 'app-song-page',
  templateUrl: './song-page.component.html',
  styleUrls: ['./song-page.component.css']
})
export class SongPageComponent implements OnInit {

  constructor(
    private activatedRoute:ActivatedRoute,
    private spotifyService:SpotifyService
    ) { }
  track:Track;
  auth_token:any;
  tokenFound:boolean;
  premiumUser:boolean;


  ngOnInit(): void {
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
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookiePair = cookies[i].split("=");
      if(cookiePair[0].trim() == "access_token"){
          console.log("Authentication Token Found");
          this.auth_token = cookiePair[1];
          this.tokenFound = true;
      }
      else {
        console.log("Authentication Token Not Found")
        this.tokenFound = false;
      }
    }
    this.isPremiumUser();
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
