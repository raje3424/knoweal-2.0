import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageMarkerComponent } from './package-marker.component';

describe('PackageMarkerComponent', () => {
  let component: PackageMarkerComponent;
  let fixture: ComponentFixture<PackageMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
