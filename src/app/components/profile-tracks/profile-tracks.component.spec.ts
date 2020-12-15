import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTracksComponent } from './profile-tracks.component';

describe('ProfileTracksComponent', () => {
  let component: ProfileTracksComponent;
  let fixture: ComponentFixture<ProfileTracksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileTracksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
