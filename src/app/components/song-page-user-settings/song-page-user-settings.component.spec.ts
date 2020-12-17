import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongPageUserSettingsComponent } from './song-page-user-settings.component';

describe('SongPageUserSettingsComponent', () => {
  let component: SongPageUserSettingsComponent;
  let fixture: ComponentFixture<SongPageUserSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongPageUserSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongPageUserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
