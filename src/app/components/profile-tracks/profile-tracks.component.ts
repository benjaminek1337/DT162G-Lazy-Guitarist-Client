import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbListedTrack } from 'src/app/models/DbListedTrack';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-tracks',
  templateUrl: './profile-tracks.component.html',
  styleUrls: ['./profile-tracks.component.css']
})
export class ProfileTracksComponent implements OnInit {

  constructor(private userservice:UserService, private router:Router) { }
  @Input() user:User;
  dbTracks: DbListedTrack[] = [];
  anyTracks: boolean;

  ngOnInit(): void {
    this.anyTracks = true;
    this.getTracks();
  }

  getTracks(){
    this.userservice.getUserTracks().subscribe(t => {
      for (let i = 0; i < t.length; i++) {
        const element = t[i];
        let dbTrack:DbListedTrack = {
          track: element.tracks.track,
          artist: element.tracks.artist,
          album: element.tracks.album,
          trackId: element.tracks.trackId,
          progress: element.progress
        }
        this.dbTracks.push(dbTrack);
        this.anyTracks = true;
      }
    }, err => {
      console.log(err.error.message);
      this.anyTracks = false;
    })
  }

  toTrack(trackId:string){
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/song/" + trackId])
    });
  }

  removeTrack(trackId:string){
    this.userservice.deleteSavedTrack(trackId).subscribe(t => {
      console.log(t);
      this.dbTracks = [];
      this.getTracks();
    }, err => {

      console.log(err);
    })
  }

}
