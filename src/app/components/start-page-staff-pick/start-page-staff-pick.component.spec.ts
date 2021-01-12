import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPageStaffPickComponent } from './start-page-staff-pick.component';

describe('StartPageStaffPickComponent', () => {
  let component: StartPageStaffPickComponent;
  let fixture: ComponentFixture<StartPageStaffPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartPageStaffPickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartPageStaffPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
