import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCartItemComponent } from './edit-cart-item.component';

describe('EditServiceComponent', () => {
  let component: EditCartItemComponent;
  let fixture: ComponentFixture<EditCartItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCartItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
