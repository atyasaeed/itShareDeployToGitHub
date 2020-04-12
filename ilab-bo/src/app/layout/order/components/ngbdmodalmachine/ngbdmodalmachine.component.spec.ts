import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdmodalmachineComponent } from './ngbdmodalmachine.component';

describe('NgbdmodalmachineComponent', () => {
  let component: NgbdmodalmachineComponent;
  let fixture: ComponentFixture<NgbdmodalmachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgbdmodalmachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbdmodalmachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
