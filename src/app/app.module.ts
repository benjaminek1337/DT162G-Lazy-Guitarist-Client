import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http"

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpotifySearchComponent } from './components/spotify-search/spotify-search.component';
import { SpotifyPlayerComponent } from './components/spotify-player/spotify-player.component';
import { TrackItemComponent } from './components/track-item/track-item.component';
import { SongPageComponent } from './components/song-page/song-page.component';
import { StartPageComponent } from './components/start-page/start-page.component';
import { HeaderComponent } from './components/header/header.component';
import { SpotifyNotAuthenticatedComponent } from './components/spotify-not-authenticated/spotify-not-authenticated.component';

@NgModule({
  declarations: [
    AppComponent,
    SpotifySearchComponent,
    SpotifyPlayerComponent,
    TrackItemComponent,
    SongPageComponent,
    StartPageComponent,
    HeaderComponent,
    SpotifyNotAuthenticatedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
