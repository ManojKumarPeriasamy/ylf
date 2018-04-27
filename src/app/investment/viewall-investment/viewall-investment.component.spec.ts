import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewallInvestmentComponent } from './viewall-investment.component';

describe('ViewallInvestmentComponent', () => {
  let component: ViewallInvestmentComponent;
  let fixture: ComponentFixture<ViewallInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewallInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewallInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
