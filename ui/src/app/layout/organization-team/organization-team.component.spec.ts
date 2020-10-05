import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationTeamComponent } from './organization-team.component';

describe('OrganizationTeamComponent', () => {
  let component: OrganizationTeamComponent;
  let fixture: ComponentFixture<OrganizationTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationTeamComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
