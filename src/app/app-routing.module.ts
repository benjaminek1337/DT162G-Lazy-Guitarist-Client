import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { SongPageComponent } from "./components/song-page/song-page.component"
import { StartPageComponent } from "./components/start-page/start-page.component"

const routes: Routes = [
  { path: "", component:StartPageComponent },
  { path: "index", component:StartPageComponent },
  { path: "song/:id", component: SongPageComponent },
  { path: "register", component: RegisterComponent },
  { path: "profile", component: ProfileComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
