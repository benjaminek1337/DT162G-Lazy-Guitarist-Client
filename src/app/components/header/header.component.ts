import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/models/User';
import { UserService } from "../../services/user.service"


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router:Router, private userservice:UserService, private cookieService:CookieService) { }
  user_auth_token: string;
  user:User;

  ngOnInit(): void {
    if(this.cookieService.check("sid")){
      this.user_auth_token = this.cookieService.get("sid");
      this.userservice.getUser().subscribe(u => {
        this.user = u;
      })
    }
  }

  toIndex(){
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/index"]);
    });
  }

  toLogin(){
    if(this.user && this.user_auth_token){
      return this.toProfile();
    }
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/login"]);
    });
  }

  toRegister(){
    if(this.user && this.user_auth_token){
      return this.toProfile();
    }
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/register"]);
    });
  }

  toProfile(){
    if(!this.user && !this.user_auth_token){
      return this.toLogin();
    }
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/profile"]);
    });
  }

  logout(){
    this.userservice.logout().subscribe(r => {
      if(r != "200"){
        return console.log("Kunde inte logga ut")
      }
      this.user = null;
      this.cookieService.delete("sid", "/")
      window.location.pathname = "/index";
    })
  }

}
