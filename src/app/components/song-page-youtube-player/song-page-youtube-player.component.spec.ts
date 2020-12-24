import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongPageYoutubePlayerComponent } from './song-page-youtube-player.component';

describe('SongPageYoutubePlayerComponent', () => {
  let component: SongPageYoutubePlayerComponent;
  let fixture: ComponentFixture<SongPageYoutubePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongPageYoutubePlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongPageYoutubePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
