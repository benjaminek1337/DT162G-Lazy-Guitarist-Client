import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { FormControl, NgForm } from "@angular/forms"

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {

  constructor() { }
  @Input() user:User;
  passwordErrorMsg:string;
  userErrorMsg:string;

  ngOnInit(): void {
  }

  updateUser(form:NgForm){
    // Om inga tomma fält
    if(form.value.username && form.value.email){
      // Validera mot db. INGA DUBBLETTER EMAIL
      this.userErrorMsg = "";
      return console.log(form.value);
    } else 
      return this.userErrorMsg = "Fyll i fälten"
  }

  updatePassword(form:NgForm){
    // Validera lösenord mot databas först
    if(form.value.newPassword != form.value.repeatPassword){

      return this.passwordErrorMsg = "Nya lösenorden stämmer ej överens";
    }
    // Byt lösenord
    console.log(form.value);
    return this.passwordErrorMsg = "";
  }

}
