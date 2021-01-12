import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Track } from 'src/app/models/Track';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-start-page-staff-pick',
  templateUrl: './start-page-staff-pick.component.html',
  styleUrls: ['./start-page-staff-pick.component.css']
})
export class StartPageStaffPickComponent implements OnInit {

  constructor(private spotifyservice:SpotifyService, private router:Router) { }

  ngOnInit(): void {
    this.getStaffPickPlaylist();
  }

  staffPick: Track; // Objekt innehållande information om ett spår

  // Hämta spellistan Staff Picks från server -> spotifyAPI
  getStaffPickPlaylist(){
    const playlistId = "1fdzHcibaEYdF5AKLKvxgA"; // Spellistans ID
    this.spotifyservice.getPlaylistById(playlistId).subscribe(p => {
      const trackId:number = Math.floor(Math.random() * (p.tracks.items.length - 1)); // Hämta ett slumpmässigt utvalt spår
      this.getStaffPickTrackFromPlaylist(p.tracks.items[trackId].track);
    }, err => {
      console.log(err);
    })
  }

  // Fyll staffPick-objektet med data från den slumpmässigt utvalda låten
  getStaffPickTrackFromPlaylist(t:any){
    this.staffPick = {
      id: t.id,
      title: t.name,
      album: t.album.name,
      albumcover: t.album.images[1].url,
      artist: (t.artists.length > 1) ? this.getAllArtists(t) : t.artists[0].name,
      duration: t.duration_ms
    }
    this.cutOffUnwantedSongTitleParts();
  }

  // Hämta alla artister kopplad till låten och formatera den strängen
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

  // Kapa bort onödiga ord från låtens titel
  cutOffUnwantedSongTitleParts():void{
    const naughtyWords = ["(remastered)", "(remaster)", "remastered", "remaster",]
    if(this.contains(this.staffPick.title.toLocaleLowerCase(), naughtyWords)){
      const splitTitle = this.staffPick.title.split("-");
      if(splitTitle.length > 1){
        this.staffPick.title = "";
        for (let i = 0; i < splitTitle.length; i++) {
          if(!this.contains(splitTitle[i].toLocaleLowerCase(), naughtyWords)){
            this.staffPick.title += splitTitle[i];
          }
        }
      } else {
        for (let i = 0; i < naughtyWords.length; i++) {
          const naughtyWord = naughtyWords[i];
          if(this.staffPick.title.toLocaleLowerCase().includes(naughtyWord)){
            this.staffPick.title = this.staffPick.title.toLocaleLowerCase().replace(naughtyWord, "");
          }
        }
      }
    }
  }

  // Kolla om sträng innehåller ord från array
  contains(target, pattern):boolean{
    for (let i = 0; i < pattern.length; i++) {
      const element = pattern[i];
      if(target.includes(element))
        return true;
    }
    return false;
  }

  // Routa till låt-sidan för vald låt
  toTrack(){
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/song/" + this.staffPick.id])
    });
  }

}
