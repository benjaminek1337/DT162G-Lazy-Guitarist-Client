///  <reference types="@types/spotify-web-playback-sdk"/>
// Ovantill - referens till Spotifys web playback sdk. Dock får jag inte ordning på att använda den
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Track } from 'src/app/models/Track';
import { SpotifyService } from "../../services/spotify.service";

// Riktig raggarlösning. Men jag kan inte lyckas använda spotify sdkn genom npmreferensen ovan.
// Hata mig inte

function getToken(_token){ // Hämtar autenticeringstoken
  token = _token;
}
function getTrack(_track){ // Hämtar spåret som ska spelas
  track = _track;
}

let track; 
let token;
let id; // Enhetens ID
let player; // Spotify player objekt

// Initialisera Spotifyplayer objektet
window.onSpotifyWebPlaybackSDKReady = () => {
  player = new Spotify.Player({
    name: 'Lazy Guitarist Player',
    getOAuthToken: cb => { cb(token); }
  });

  // Eventlisteners kopplade till spotifyspelarobjektet
  // Felhantering
  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  //player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Spelaren redo
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    id = device_id;
    player.setVolume(0.8);
  });

  // Spelaren inte redo
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  // Playbackstatus uppdaterad
  player.addListener('player_state_changed', state => { 
    //console.log(state); 
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
  @Input() track:Track; // Valt spår
  @Input() auth_token:string; // Auth-token från soptify
  loadAPI: Promise<any>; // Promise som när resolvat laddar in spotifyspelaren till DOMen
  playBtn: string; // String som styr CSS-klass till spela-knappen
  volumeBtn: string;  // String som styr CSS-klass till volymknappen
  volume: number; // Värde på volumslider
  durationSlider: number; // Hur lång låten är i ms - appliceras på slidern som visar låtens duration
  playbackPosition: number; // Hur långt låten spelats i ms
  songLoaded: boolean; // Har en låt blivit laddad in till spelaren
  playbackInterval: any; // Interval som löpande uppdaterar duration-slidern med aktuell position i låten
  playerArea: string; // Sträng för CSS-klass till hela spelaren

  ngOnInit(): void {

    getToken(this.auth_token);
    getTrack(this.track.id);
    this.playerArea = "player-area-disabled"; // Spelare olickbar tills spelarobjektet är redo
    this.loadAPI = new Promise(async (resolve) => {
      this.loadSpotifySDKScript();
      resolve(true);
    }).then(res => {
      setTimeout(() => {
        player.connect();
        this.playerArea = "player-area";
      }, 250)
    })
    .catch(res => console.log("Error: " + res));
    this.playBtn = "paused"; //Grundläge för spelaknappens CSS
    this.songLoaded = false; // Låt ej inladdad än
    this.durationSlider = this.track.duration; // Sätt värde på duration-slidern
    this.playbackPosition = 0; // Nolla durationsliderns position
    this.volume = 80; // Sätt grundvolym
  }

  // Disconnecta spelaren och rensa playback-intervallet
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event){
    this.songLoaded = false;
    player.disconnect();
    clearInterval(this.playbackInterval);
  }

  // Disconnecta spelaren och rensa playback-intervallet
  ngOnDestroy(){
    this.songLoaded = false;
    player.disconnect();
    clearInterval(this.playbackInterval);
  }

  // Spela/pausa låten. Ladda in låt om låt inte är inladdad 
  playBtnClick(){
      if(!this.songLoaded){
        this.loadSong();
        setTimeout(() => {
          this.playingOrPausedEvents();
        }, 350);
        this.songLoaded = true;
      }
      player.togglePlay();
  }

  // Hämta låt att spela från Spotifys API
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

  // Sätt intervall som uppdaterar properties med hur långt gången låten är, och om låten är pausad eller ej
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

  // Spola tbx låten 10 sekunder
  backTenSecBtnClick(){
    this.reverseForMs(10000);
  }

  // Spola tbx låten 30 sekunder
  backThirtySecBtnClick(){
    this.reverseForMs(30000);
  }

  // EJ IMPLEMENTERAD FUNKTION (ÄN), ställ in ett tidsintervall av låten att repterera om och om igen
  repeatInterval;
  backIntervalBtnClick(){
    // value = 1000;    
    // clearInterval(this.repeatInterval)
    // this.repeatInterval = setInterval(() => {
    //   this.reverseForMs(value);
    // }, value)
    console.log("to be implemented")
  }

  // Rensa tidsintervallsrepeteringen
  clearBackIntevalBtnClick(){
    clearInterval(this.repeatInterval);
  }

  // Minska låtens duration med x millisekunder (spola tbx)
  reverseForMs(time){
    player.getCurrentState().then(state => {
      if(!state){
        return console.log("No song is loaded");
      } 
      if(state.position > time)
        player.seek(state.position - time);
      else
        player.seek(0);
    })
  }

  // Muta volymen
  volBtnClick(){
    player.setVolume(0);
    this.volume = 0;
    this.volumeBtn = "mute";
  }

  // Ändra volym på låten
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

  // Spola fram eller tbx manuellt med duration slidern
  durationSliderChange(value){
    try {
      player.seek(value)
    } catch (error) {
      this.durationSlider = 0;
      console.log("no song is loaded")
    }
  }

  // Ladda in spotifys SDK till DOMen om den inte redan är där
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
}
