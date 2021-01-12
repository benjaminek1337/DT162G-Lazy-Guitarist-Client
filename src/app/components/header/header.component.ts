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

  isLoggedIn:boolean; // Om användaren är inloggad eller inte
  user:User; // Användarobjekt
  userSubscription:any; // Subscription som håller koll på huruvida användaren är inloggad eller ej
  usernameSubscription:any; // Subscription som håller koll på om användarnamnet ändrats
  loginForm: boolean; // Boolean som avgör om loginformulär ska visas eller ej
  errormessage:string; // Felmeddelande att presentera till gränssnitt vid inloggningsfel


  ngOnInit(): void {
    // Kolla om inloggningscookie finns. Skriva true/false till isLoggedIn beroende på. Sätta 
    // värde till user om user finns
    if(this.cookieService.check("sid")){
      this.userservice.getUser().subscribe(u => {
        this.user = u;
        this.isLoggedIn = true;
      }, err => {
        console.log(err);
      });
    }
    // Uppdatera om användare är inloggad eller ej
    this.userSubscription = this.userservice.loginStatusChange().subscribe(s => {
      this.isLoggedIn = s;
    });
    // Uppdatera om användarnamnet förändras
    this.usernameSubscription = this.userservice.usernameStatusChange().subscribe(s => {
      this.user.username = s;
    });
  }

  // Stänga subscriptions när komponent avladdas.
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if(this.usernameSubscription){
      this.usernameSubscription.unsubscribe();
    }
  }

  // Routa till index
  toIndex(){
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/index"]);
    });
  }

  // Visa loginformulär genom att toggla boolean till true
  toLogin(){
    this.loginForm = true;
  }

  // Routa till register
  toRegister(){
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/register"]);
    });
  }

  // Routa till profil
  toProfile(){
    this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
      this.router.navigate(["/profile"]);
    });
  }

  // Loginmetod. Skicka in form till server, ta emot ett user-objekt via JSON och 
  // uppdatera headern till inloggat läge. Samt routa till profile om användare loggar in
  // från sidan register
  // Hanterar fel 
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
      if(error.status < 500){ // Visa endast användarfel, inte serverfel
        this.errormessage = error.error;
      }
    });
  }

  // Nolla felmeddelande, stänga loginform
  abort(){
    this.errormessage = "";
    this.loginForm = false;
  }

  // Utloggning. Nolla user, radera cookie, routa till index om användare loggat ut från profilsida
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
