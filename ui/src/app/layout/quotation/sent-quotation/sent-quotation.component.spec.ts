import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentQuotationComponent } from './sent-quotation.component';

describe('SentQuotationComponent', () => {
  let component: SentQuotationComponent;
  let fixture: ComponentFixture<SentQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SentQuotationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
