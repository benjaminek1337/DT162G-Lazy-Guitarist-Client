import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from "../../services/user.service.js";
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userservice:UserService, private router:Router, private cookieService:CookieService) { }

  ngOnInit(): void {
    if(this.cookieService.check("sid")){
      this.userservice.getUser().subscribe(u => {
        if(u.status != 400){
          this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
            this.router.navigate(["/profile"]);
          });
        }
      })
    }
  }

  login(form:NgForm){
    this.userservice.loginUser(form.value).subscribe(r => {
      if(r.status == 200){
        window.location.pathname = "/profile";
        // this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
        //   this.router.navigate(["/profile"]); // Uppdatera headern på nått vis
        // });
      }
    }, error => {
      console.log(error);
      alert(error.error)
    });
  }

}
