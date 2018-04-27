import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTractorAllComponent } from './view-tractor-all.component';

describe('ViewTractorAllComponent', () => {
  let component: ViewTractorAllComponent;
  let fixture: ComponentFixture<ViewTractorAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTractorAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTractorAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
