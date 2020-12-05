import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyNotAuthenticatedComponent } from './spotify-not-authenticated.component';

describe('SpotifyNotAuthenticatedComponent', () => {
  let component: SpotifyNotAuthenticatedComponent;
  let fixture: ComponentFixture<SpotifyNotAuthenticatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotifyNotAuthenticatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyNotAuthenticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
