import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { NgForm } from '@angular/forms';
import { UserService } from "../../services/user.service.js"
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private userservice:UserService, private router:Router, private cookieService:CookieService) { }
  user_auth_token:string;

  ngOnInit(): void {
    if(this.cookieService.check("sid")){
      this.userservice.getUser().subscribe(u => {
        console.log(u);
        if(u.status != 400){
          this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
            this.router.navigate(["/profile"]);
          });
        }
      })
    }
  }

  register(form:NgForm){
    this.userservice.registerUser(form.value).subscribe(r => {
      if(r.status == 200){
        window.location.pathname = "/profile";
      } else {
        console.log("somethuing fukkd")
      }
    });
  }

}
