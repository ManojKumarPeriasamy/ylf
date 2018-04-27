import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMilkComponent } from './view-milk.component';

describe('ViewMilkComponent', () => {
  let component: ViewMilkComponent;
  let fixture: ComponentFixture<ViewMilkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMilkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMilkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
