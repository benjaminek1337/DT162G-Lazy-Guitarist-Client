import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { FormControl, NgForm } from "@angular/forms"
import { UserService } from 'src/app/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {

  constructor(private userservice:UserService, private cookieService:CookieService, private router:Router) { }
  @Input() user:User; // Importerad user från profilecomponent
  passwordErrorMsg:string; // Felmeddelande gällande lösenordsbyte
  userErrorMsg:string; // Felmeddelande gällande användarinfobyte

  ngOnInit(): void {
  }

  // Form för att uppdatera användarens epost och anv namn
  updateUser(form:NgForm){
    if(form.value.username && form.value.email){
      this.userservice.changeCredentials(form.value).subscribe(s => {
        this.user.email = form.value.email;
        this.user.username = form.value.username;
        this.userservice.usernameChanged(form.value.username);
        this.userErrorMsg = "";
      }, err => {
        console.log(err);
        alert(err.error);
      })
    } else 
      return this.userErrorMsg = "Fyll i fälten"
  }

  // Form för att byta användarens lösenord. Gamla lösenordet måste va korrekt
  // och nya måste valideras med repeat
  updatePassword(form:NgForm){
    if(form.value.newPassword != form.value.repeatPassword){
      return this.passwordErrorMsg = "Nya lösenorden stämmer ej överens";
    }
    this.userservice.changePassword(form.value).subscribe(s => {
      alert("Lösenord bytt");
      form.resetForm();
    }, err => {
      if(err.error.includes("Nuvarande lösenord stämmer ej"))
        this.passwordErrorMsg = err.error;
      console.log(err);
    })
    return this.passwordErrorMsg = "";
  }

  // Radera användare från databasen och logga ut, routa till index därefter
  deleteUser(){
    this.userservice.deleteUser().subscribe(r => {
      if(r != "200"){
        return console.log("Kunde inte logga ut")
      }
      this.user = null;
      this.cookieService.delete("sid", "/")

      this.router.navigateByUrl("/", {skipLocationChange:true}).then(() => {
        this.router.navigate(["/index"]);
      });
      
    })
  }

}
