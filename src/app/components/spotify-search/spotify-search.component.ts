import { Component, OnInit } from '@angular/core';
import { SpotifyService } from "../../services/spotify.service"
import { Track } from "../../models/Track"
import { NavigationExtras, NavigationStart, Router } from "@angular/router"

@Component({
  selector: 'app-spotify-search',
  templateUrl: './spotify-search.component.html',
  styleUrls: ['./spotify-search.component.css']
})
export class SpotifySearchComponent implements OnInit {

  constructor(private spotifyService:SpotifyService, private router:Router) { }
  
  
  timeout: any; // Timeout som avgör om sökning ska göras
  tracks: Track[] = []; // Array med hämtade spår
  

  ngOnInit(): void {

  }

  // Vänta 300ms från sista input till sökrutan 
  // Därefter - Hämta spår genom sökning mot server -> spotifys API och fyll array med spåren
  searchTrack(input: any){ 
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.tracks.length = 0;
      if(input.length > 2){
        this.spotifyService.getTracks(input).subscribe(t => {
          for (let i = 0; i < t.tracks.items.length; i++) {
            const element = t.tracks.items[i];
            let track:Track = {
              id: element.id,
              title: element.name,
              album: element.album.name,
              albumcover: element.album.images[1].url,
              artist: (element.artists.length > 1) ? this.getAllArtists(element) : element.artists[0].name,
              duration: element.duration_ms
            }
            this.tracks.push(track);
          }
        });
      }
    }, 300) 
  }

  // Returnera samtliga artister kopplat till låten, och formatera sträng
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

  // Töm låt-arrayen, routa om användaren till spårets sida
  getTrack(track:Track){
    this.tracks.length = 0;
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/song/" + track.id])
    });
  }

}
