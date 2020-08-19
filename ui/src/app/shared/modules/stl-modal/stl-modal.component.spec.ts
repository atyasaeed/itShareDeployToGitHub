import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StlModalComponent } from './stl-modal.component';

describe('StlModalComponent', () => {
  let component: StlModalComponent;
  let fixture: ComponentFixture<StlModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StlModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
