import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/models/User';
import { UserService } from "../../services/user.service"
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router:Router, 
    private userservice:UserService, 
    private cookieService:CookieService
  ) { }

  isLoggedIn:boolean;
  user:User;
  userSubscription:any;
  usernameSubscription:any;
  loginForm: boolean;
  errormessage:string;

  // TODO - Försök att uppdatera headern utan att reloada sidan

  ngOnInit(): void {
    if(this.cookieService.check("sid")){
      this.userservice.getUser().subscribe(u => {
        this.user = u;
      }, err => {
        console.log(err);
      });
      this.isLoggedIn = true;
    }
    this.userSubscription = this.userservice.loginStatusChange().subscribe(s => {
      this.isLoggedIn = s;
    });
    this.usernameSubscription = this.userservice.usernameStatusChange().subscribe(s => {
      this.user.username = s;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toIndex(){
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/index"]);
    });
  }

  toLogin(){
    this.loginForm = true;
  }

  toRegister(){
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/register"]);
    });
  }

  toProfile(){
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/profile"]);
    });
  }

  login(form:NgForm){
    this.userservice.loginUser(form.value).subscribe(r => {
      this.errormessage = "";
      
        this.userservice.loginSuccess();
        this.user = r;
        this.loginForm = false;
        if(window.location.pathname.includes("register")){
          this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
            this.router.navigate(["/profile"]);
          });
        }
  
    }, error => {
      this.userservice.loginFailed();
      this.isLoggedIn = false;
      this.errormessage = error.error;
      console.log(error);
    });
  }

  abort(){
    this.errormessage = "";
    this.loginForm = false;
  }

  logout(){
    this.userservice.logout().subscribe(r => {
      if(r != "200"){
        return console.log("Kunde inte logga ut")
      }
      this.user = null;
      this.cookieService.delete("sid", "/")
      //this.isLoggedIn = false;
      if(window.location.pathname.includes("/profile")){
        this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
          this.router.navigate(["/index"]);
        });
      }
    })
  }

}
