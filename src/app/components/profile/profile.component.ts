import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router"
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private cookieService:CookieService, private router:Router, private userService:UserService) { }
  user: User;
  subroute:string;

  ngOnInit(): void {
    if(!this.cookieService.check("sid")){
      this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
        this.router.navigate(["/register"]);
      });
    }
    else{
      this.userService.getUser().subscribe(u => {
        this.user = u;
      })
    }
    this.subroute = "form";
  }

  toForm(){
    this.subroute = "form";
  }

  toTracks(){
    this.subroute = "tracks";
  }

}
