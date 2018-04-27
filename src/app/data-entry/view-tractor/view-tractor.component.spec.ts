import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTractorComponent } from './view-tractor.component';

describe('ViewTractorComponent', () => {
  let component: ViewTractorComponent;
  let fixture: ComponentFixture<ViewTractorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
