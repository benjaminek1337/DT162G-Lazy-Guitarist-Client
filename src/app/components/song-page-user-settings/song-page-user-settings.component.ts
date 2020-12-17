import { Component, Input, OnInit } from '@angular/core';
import { DbSavedTrack } from 'src/app/models/DbSavedTrack';
import { DbTrack } from 'src/app/models/DbTrack';
import { Track } from 'src/app/models/Track';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-song-page-user-settings',
  templateUrl: './song-page-user-settings.component.html',
  styleUrls: ['./song-page-user-settings.component.css']
})
export class SongPageUserSettingsComponent implements OnInit {

  constructor(private userservice:UserService) { }

  @Input() track:Track;

  dbTrack:DbTrack;
  dbSavedTrack:DbSavedTrack;

  isTrackSaved:string;
  likeBtnDisabled:boolean;
  dislikeBtnDisabled:boolean;
  progress:string;

  ngOnInit(): void {
    this.getTrackdataFromDb();
  }

  async getTrackdataFromDb(){
    this.userservice.getSavedTrack(this.track.id).subscribe(t => {
      if(t){
        this.dbSavedTrack = t;
        this.isTrackSaved = "yes";
        this.dislikeBtnDisabled = t.disliked;
        this.likeBtnDisabled = t.liked;
        this.progress = t.progress;
      } else {
        this.isTrackSaved = "no";
        this.dislikeBtnDisabled = false;
        this.likeBtnDisabled = false;
      }
    }, err => {
      console.log("Spår finns ej i db");
    });
    this.userservice.getTrack(this.track.id).subscribe(t => {
      if(t)
        this.dbTrack = t;
    }, err => {
      console.log("Spår finns ej i db");
    });
  }

  isLikeBtnDisabled(){
    if(!this.dbSavedTrack)
      return this.likeBtnDisabled = false;
    return this.likeBtnDisabled =  this.dbSavedTrack.liked;
  }

  isDislikeBtnDisabled(){
    if(!this.dbSavedTrack)
      return this.dislikeBtnDisabled = false;
      return this.dislikeBtnDisabled =  this.dbSavedTrack.disliked;
  }

  likesValue(){
    if(!this.dbTrack){
      return 0;
    }
    return this.dbTrack.likes;
  }

  dislikesValue(){
    if(!this.dbTrack){
      return 0;
    }
    return this.dbTrack.dislikes;
  }

  saveTrack(){
    const track = { 
      trackId: this.track.id,
      track: this.track.title,
      artist: this.track.artist,
      album: this.track.album
    };
    this.userservice.saveTrack(track).subscribe(t => {
      console.log(t);
      this.isTrackSaved = "yes";
      this.progress = "Vill lära mig";
    }, err => {
      console.log(err);
    })
  }

  setProgression(progress:string){
    const body = {
      trackId: this.track.id,
      progress: progress
    };
    this.userservice.setProgression(body).subscribe(s => {
      console.log(s);
    }, err => {
      console.log(err);
    })
  }

  rate(liked:string){
    const body = { 
      trackId: this.track.id,
      liked: (liked == "liked") ? true : false,
      disliked: (liked == "liked") ? false : true,
      track: this.track.title,
      artist: this.track.artist,
      album: this.track.album
    }
    this.userservice.rateTrack(body).subscribe(s => {
      this.dislikeBtnDisabled = (s == "false") ? true : false;
      this.likeBtnDisabled = (s == "true") ? true : false;
      this.userservice.getTrack(this.track.id).subscribe(t => {
        this.dbTrack = t;
      }, err => {
        console.log("Något hände vid rating")
      })
    }, err => {
      console.log(err);
    })
  }

}
