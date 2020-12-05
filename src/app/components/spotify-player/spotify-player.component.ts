///  <reference types="@types/spotify-web-playback-sdk"/>
// Ovantill - referens till Spotifys web playback sdk. Dock får jag inte ordning på att använda den
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Track } from 'src/app/models/Track';
import { SpotifyService } from "../../services/spotify.service";

// Riktig raggarlösning. Men jag kan fan inte lyckas använda spotify sdkn genom npm paket.
// Hata mig inte

function getToken(_token){ // Gets the auth token
  token = _token;
}
function getTrack(_track){ // Get the track
  track = _track;
}

let track;
let token;
let id; // Device Id
let player; // Spotify player object


window.onSpotifyWebPlaybackSDKReady = () => {
  player = new Spotify.Player({
    name: 'Lazy Guitarist Player',
    getOAuthToken: cb => { cb(token); }
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    id = device_id;
    player.setVolume(0.8);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  // Playback status updates
  player.addListener('player_state_changed', state => { 
    console.log(state); 
  });
};


@Component({
  selector: 'app-spotify-player',
  templateUrl: './spotify-player.component.html',
  styleUrls: ['./spotify-player.component.css']
})
export class SpotifyPlayerComponent implements OnInit {

  constructor(
    private spotifyService:SpotifyService, 
  ) { }
  @Input() track:Track; // The selected track
  @Input() auth_token:string; // Spotify authorization token
  loadAPI: Promise<any>; // Promise which resolves into the loading of the spotify sdk into a script tag in the HTML document head

  playBtn: string; // Class string for play btn
  volumeBtn: string;  // Class string for vol btn
  volume: number; // Value of the volume slider
  durationSlider: number; // Max value of the song duration slider
  playbackPosition: number; // Current playback position
  songLoaded: boolean; // Has a song been loaded to the player
  playbackInterval: any; // Interval where the current state of the song is set

  ngOnInit(): void {
    //this.authenticate();
    getToken(this.auth_token);
    getTrack(this.track.id)
    this.loadAPI = new Promise((resolve) => {
      this.loadSpotifySDKScript();
      resolve(true);
    });
    this.playBtn = "paused"
    this.songLoaded = false;
    this.durationSlider = this.track.duration;
    this.playbackPosition = 0;
    this.volume = 80;
    setTimeout(() => {
      player.connect();      
    }, 200)
  }

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event){
    console.log("beforeUnload event fired")
    this.songLoaded = false;
    player.disconnect();
    clearInterval(this.playbackInterval);
  }

  ngOnDestroy(){
    console.log("ngOnDestroy event fired")
    this.songLoaded = false;
    player.disconnect();
    clearInterval(this.playbackInterval);
  }

  playBtnClick(){
      if(!this.songLoaded){
        this.loadSong();
        setTimeout(() => {
          this.playingOrPausedEvents();
        }, 250);
        this.songLoaded = true;
      }
      player.togglePlay();
  }

  loadSong(){
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: ["spotify:track:"+ track] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
    });
    console.log("song loaded");
  } 

  playingOrPausedEvents(){
  this.playbackInterval = setInterval(() => {
        player.getCurrentState().then(state => {
          this.playbackPosition =  state.position;
          if(state.paused)
            this.playBtn = "paused";
          else
            this.playBtn = "playing";
        })
    }, 300)
  }

  backTenSecBtnClick(){
    this.reverseForMs(10000);
  }

  backThirtySecBtnClick(){
    this.reverseForMs(30000);
  }
  repeatInterval;
  backIntervalBtnClick(){
    // value = 1000;    
    // clearInterval(this.repeatInterval)
    // this.repeatInterval = setInterval(() => {
    //   this.reverseForMs(value);
    // }, value)
    console.log("to be implemented")
  }

  clearBackIntevalBtnClick(){
    clearInterval(this.repeatInterval);
  }

  reverseForMs(time){
    player.getCurrentState().then(state => {
      if(!state){
        return console.log("No song is loaded, fucko");
      } 
      if(state.position > time)
        player.seek(state.position - time);
      else
        player.seek(0);
    })
  }

  volBtnClick(){
    player.setVolume(0);
    this.volume = 0;
    this.volumeBtn = "mute";
  }

  volSliderChange(value){
    this.volume = value;
    player.setVolume(value / (100 + ((100 - value) * 2)));
      if(value > 50){
        this.volumeBtn = "high";
      } else if (value > 0 && value <= 50) {
        this.volumeBtn = "low"
      } else{
        this.volumeBtn = "mute"
      }
  }

  durationSliderChange(value){
    try {
      player.seek(value)
    } catch (error) {
      this.durationSlider = 0;
      console.log("no song is loaded, fucko")
    }
  }

  loadSpotifySDKScript(){
    let isFound = false;
    let scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const element = scripts[i];
      if(element.getAttribute("src") != null && element.getAttribute("src").includes("spotify-player")){
        isFound = true;
      }
    }
    if(!isFound){
      let scriptUrl = "https://sdk.scdn.co/spotify-player.js";
      const node = document.createElement("script");
      node.src = scriptUrl;
      node.type = 'text/javascript';
      node.async = true;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

  // authenticate(){
  //   // Bryt ut autenticering till en annan komponent (klicka här för autenticering eller nått, tänk om flödet lite)
  //   let cookies = document.cookie.split(";");
  //   for (let i = 0; i < cookies.length; i++) {
  //     const cookiePair = cookies[i].split("=");
  //     if(cookiePair[0].trim() == "access_token"){
  //         console.log("Authentication Token Found");
  //         this.auth_token = cookiePair[1];
  //     }
  //     else {
  //       console.log("Fetching Authentication Token")
  //       this.spotifyService.getAuthenticated(window.location.href);
  //     }
  //   }
  // }
}
