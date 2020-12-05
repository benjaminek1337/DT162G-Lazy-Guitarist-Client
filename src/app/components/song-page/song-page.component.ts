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

  constructor(private activatedRoute:ActivatedRoute, private spotifyService:SpotifyService) { }
  track:Track;
  auth_token:any;
  tokenFound:boolean;
  premiumUser:boolean;


  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    this.spotifyService.getTrackByUri(id).subscribe(t => {
      let track:Track = {
        id: t.id,
        title: t.name,
        album: t.album.name,
        albumcover: t.album.images[1].url,
        artist: t.artists[0].name,
        duration: t.duration_ms
      }
      this.track = track;
    })
    this.authenticate();
  }

  authenticate(){
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

  isPremiumUser(){
    this.spotifyService.getCurrentUser(this.auth_token).subscribe(u => {
      if(u.product == "premium")
        this.premiumUser = true;
    });
  }
}
