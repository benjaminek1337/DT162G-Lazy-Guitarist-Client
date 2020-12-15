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
      window.location.pathname = "/profile";
    }, error => {
      console.log(error);
      alert(error.error)
    });
  }

}
