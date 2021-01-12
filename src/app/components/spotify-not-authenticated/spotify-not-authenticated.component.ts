import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { emit } from 'process';
import { SpotifyService } from "../../services/spotify.service"

@Component({
  selector: 'app-spotify-not-authenticated',
  templateUrl: './spotify-not-authenticated.component.html',
  styleUrls: ['./spotify-not-authenticated.component.css']
})
export class SpotifyNotAuthenticatedComponent implements OnInit {

  constructor(private spotifyService:SpotifyService) { }

  ngOnInit(): void {
  }

  // Autenticera användaren mot Spotify
  authenticate(){
    console.log("Fetching Authentication Token")
    this.spotifyService.getAuthenticated(window.location.href);
  }

}
