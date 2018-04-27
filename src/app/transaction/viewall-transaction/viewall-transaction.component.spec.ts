import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewallTransactionComponent } from './viewall-transaction.component';

describe('ViewallTransactionComponent', () => {
  let component: ViewallTransactionComponent;
  let fixture: ComponentFixture<ViewallTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewallTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewallTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
