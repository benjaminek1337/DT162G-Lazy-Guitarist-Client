import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { SongPageComponent } from "./components/song-page/song-page.component"
import { StartPageComponent } from "./components/start-page/start-page.component"

const routes: Routes = [
  { path: "index", component:StartPageComponent },
  { path: "", component:StartPageComponent },
  { path: "song/:id", component: SongPageComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "profile", component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
