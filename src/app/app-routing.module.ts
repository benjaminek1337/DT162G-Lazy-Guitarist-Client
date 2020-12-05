import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongPageComponent } from "./components/song-page/song-page.component"
import { StartPageComponent } from "./components/start-page/start-page.component"

const routes: Routes = [
  { path: "", component:StartPageComponent},
  { path: "song/:id", component: SongPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
