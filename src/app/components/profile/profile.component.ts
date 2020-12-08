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

  ngOnInit(): void {
    if(!this.cookieService.check("sid")){
      this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
        this.router.navigate(["/login"]);
      });
    }
    else{
      this.userService.getUser().subscribe(u => {
        this.user = u;
      })
    }
  }

}
