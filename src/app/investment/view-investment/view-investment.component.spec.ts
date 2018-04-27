import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvestmentComponent } from './view-investment.component';

describe('ViewInvestmentComponent', () => {
  let component: ViewInvestmentComponent;
  let fixture: ComponentFixture<ViewInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
