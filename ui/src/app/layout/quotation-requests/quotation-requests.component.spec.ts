import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationRequestsComponent } from './quotation-requests.component';

describe('QuotationRequestsComponent', () => {
  let component: QuotationRequestsComponent;
  let fixture: ComponentFixture<QuotationRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationRequestsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
