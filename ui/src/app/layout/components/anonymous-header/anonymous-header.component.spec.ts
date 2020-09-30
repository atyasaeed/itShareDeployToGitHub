import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousHeaderComponent } from './anonymous-header.component';

describe('AnonymousHeaderComponent', () => {
  let component: AnonymousHeaderComponent;
  let fixture: ComponentFixture<AnonymousHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnonymousHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymousHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
