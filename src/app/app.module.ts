import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpotifySearchComponent } from './components/spotify-search/spotify-search.component';
import { SpotifyPlayerComponent } from './components/spotify-player/spotify-player.component';
import { TrackItemComponent } from './components/track-item/track-item.component';
import { SongPageComponent } from './components/song-page/song-page.component';
import { StartPageComponent } from './components/start-page/start-page.component';
import { HeaderComponent } from './components/header/header.component';
import { SpotifyNotAuthenticatedComponent } from './components/spotify-not-authenticated/spotify-not-authenticated.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    SpotifySearchComponent,
    SpotifyPlayerComponent,
    TrackItemComponent,
    SongPageComponent,
    StartPageComponent,
    HeaderComponent,
    SpotifyNotAuthenticatedComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
