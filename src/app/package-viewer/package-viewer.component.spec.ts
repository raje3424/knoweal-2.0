import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageViewerComponent } from './package-viewer.component';

describe('PackageViewerComponent', () => {
  let component: PackageViewerComponent;
  let fixture: ComponentFixture<PackageViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
