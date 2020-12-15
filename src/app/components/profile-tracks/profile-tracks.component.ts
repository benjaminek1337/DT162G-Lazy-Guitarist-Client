import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-profile-tracks',
  templateUrl: './profile-tracks.component.html',
  styleUrls: ['./profile-tracks.component.css']
})
export class ProfileTracksComponent implements OnInit {

  constructor() { }
  @Input() user:User;
  ngOnInit(): void {
  }

}
