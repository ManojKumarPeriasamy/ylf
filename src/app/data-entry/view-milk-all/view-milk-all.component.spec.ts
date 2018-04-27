import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMilkAllComponent } from './view-milk-all.component';

describe('ViewMilkAllComponent', () => {
  let component: ViewMilkAllComponent;
  let fixture: ComponentFixture<ViewMilkAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMilkAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMilkAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
