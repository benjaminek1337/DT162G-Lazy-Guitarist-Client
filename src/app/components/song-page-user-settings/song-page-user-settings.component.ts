import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ɵEmptyOutletComponent } from '@angular/router';
import { DbLikedTrack } from 'src/app/models/DbLikedTrack';
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
  @Output() likePercentageEmitter = new EventEmitter<number>();

  dbTrack:DbTrack; // Objekt med info om låten från DB
  dbSavedTrack:DbSavedTrack; // Objekt med info om användarens progress till låten
  dbLikedTrack:DbLikedTrack; // Objekt med info om användaren gillat/ogillat låten

  isTrackSaved:string; // Har användarens sparat spåret
  likeBtnDisabled:boolean; // Ska like-knappen va klickbar
  dislikeBtnDisabled:boolean; // Ska dislikeknappen va klickbar
  progress:string; // Hur går det för användaren med låten

  ngOnInit(): void {
    this.getTrackdataFromDb();
  }

  // Hämta data till objekten dbTrack, dbSavedTrack, dbLikedTrack
  // Hantera properties som styr gränssnittskontroller utifrån responserna
  getTrackdataFromDb(){
    this.userservice.getLikedTrack(this.track.id).subscribe(t => {
      if(t){
        this.dbLikedTrack = t;
        this.dislikeBtnDisabled = t.disliked;
        this.likeBtnDisabled = t.liked;
      } else {
        this.dislikeBtnDisabled = false;
        this.likeBtnDisabled = false;
      }
    })
    this.userservice.getSavedTrack(this.track.id).subscribe(t => {
      if(t){
        this.dbSavedTrack = t;
        this.isTrackSaved = "yes";
        this.progress = t.progress;
      } else {
        this.isTrackSaved = "no";
      }
    }, err => {
      console.log("Spår finns ej i db");
    });
    this.userservice.getTrack(this.track.id).subscribe(t => {
      if(t)
        this.dbTrack = t;
        this.getLikePercentage();
    }, err => {
      console.log("Spår finns ej i db");
    });
  }

  // Ta reda på hur stor andel användare som gillat en låtsida
  getLikePercentage(){
    let likePercentage: number;
    if(this.dbTrack && this.dbTrack.likes + this.dbTrack.dislikes > 0){
      likePercentage = this.dbTrack.likes / (this.dbTrack.likes + this.dbTrack.dislikes) * 100;
    } else {
      likePercentage = -1;
    }
    this.likePercentageEmitter.emit(likePercentage);
  }

  // Metod som avgör om like-knappen ska va klickbar
  isLikeBtnDisabled(){
    if(!this.dbSavedTrack)
      return this.likeBtnDisabled = false;
    return this.likeBtnDisabled =  this.dbLikedTrack.liked;
  }

  // Metod som avgör om dislike-knappen ska va klickbar
  isDislikeBtnDisabled(){
    if(!this.dbSavedTrack)
      return this.dislikeBtnDisabled = false;
      return this.dislikeBtnDisabled =  this.dbLikedTrack.disliked;
  }

  // Antalet likes låten har
  likesValue(){
    if(!this.dbTrack){
      return 0;
    }
    return this.dbTrack.likes;
  }

  // Antalet dislikes låten har
  dislikesValue(){
    if(!this.dbTrack){
      return 0;
    }
    return this.dbTrack.dislikes;
  }

  // Spara spåret till användaren
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

  // Metod som sätter användarens progression till låten
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

  // Användaren gillar/ogillar låten. Detta sparas till db
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
        this.getLikePercentage();
      }, err => {
        console.log("Något hände vid rating")
      })
    }, err => {
      console.log(err);
    })
  }

}
