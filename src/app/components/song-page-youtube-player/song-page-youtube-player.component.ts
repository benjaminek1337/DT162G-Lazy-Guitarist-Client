import { Component, Input, OnInit } from '@angular/core';
import { Track } from 'src/app/models/Track';
import { YoutubeService } from 'src/app/services/youtube.service';

@Component({
  selector: 'app-song-page-youtube-player',
  templateUrl: './song-page-youtube-player.component.html',
  styleUrls: ['./song-page-youtube-player.component.css']
})
export class SongPageYoutubePlayerComponent implements OnInit {

  constructor(private youtubeservice:YoutubeService) { }

  @Input() track:Track; // Spårdata, hämtad från song-page
  videoId:String; // ID till Youtube-video till spelaren
  videoList:any[] = [] // Lista över videor kopplat till sökningen
  videoListShowing:boolean = false; // Ska listan över videor visas i gränssnittet

  ngOnInit(): void {
    this.getVideoList();
    const tag = document.createElement('script'); // Skapa scripttagg
    tag.src = 'https://www.youtube.com/iframe_api'; // Sätt source till scripttaggen
    document.body.appendChild(tag); // Appenda scripttaggen till HTML-dokumentet
  }

  // Visa eller inte visa listan över videor
  displayVideoList(display:boolean){
    this.videoListShowing = display;
  }

  // Hämta data över videor utifrån sökning mot youtube, fyll array med datan
  getVideoList(){
    this.videoList = []
    this.youtubeservice.getVideo(this.track.title + " " + this.track.artist).subscribe(r => {
      for (let i = 0; i < r.length; i++) {
        const element = r[i];
        this.videoList.push(element);
      }
      this.videoId = r[0].id.videoId;
      console.log(r[0])
    }, err => {
      console.log("Maximala antalet sökningar har nog gjorts.")
    })
  }

  // Byt värde på videoId (byt video till spelaren)
  changeVideo(id:string){
    this.videoId = id;
  }

}
