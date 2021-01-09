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

  @Input() track:Track;
  videoId:String;
  videoList:any[] = []
  videoListShowing:boolean = false;

  ngOnInit(): void {
    this.getVideoList();
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  displayVideoList(display:boolean){
    this.videoListShowing = display;
  }

  getVideoList(){
    this.videoList = []
    this.youtubeservice.getVideo(this.track.title + " " + this.track.artist).subscribe(r => {
      for (let i = 0; i < r.length; i++) {
        const element = r[i];
        this.videoList.push(element);
      }
      this.videoId = r[0].id.videoId;
    }, err => {
      console.log("Maximala antalet sökningar har nog gjorts.")
    })
  }

  changeVideo(id:string){
    this.videoId = id;
  }

}
