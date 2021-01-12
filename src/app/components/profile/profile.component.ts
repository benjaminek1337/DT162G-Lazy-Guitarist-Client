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
  user: User; // Användarobjekt
  subroute:string; // Avgör vad som ska visas på profilsidan

  ngOnInit(): void {
    // Kollar om inte cookie finns, reroute till registersida isf
    if(!this.cookieService.check("sid")){
      this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
        this.router.navigate(["/register"]);
      });
    }
    // Annars - hämta användare från db
    else{
      this.userService.getUser().subscribe(u => {
        this.user = u;
      })
    }
    this.subroute = "tracks"; // Default - visa användarens sparade spår
  }

  // Till inställnignar för användarkonto
  toForm(){
    this.subroute = "form";
  }

  // Till användarens sparade spår
  toTracks(){
    this.subroute = "tracks";
  }

}
