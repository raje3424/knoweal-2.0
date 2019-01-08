import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnPackageViewerComponent } from './own-package-viewer.component';

describe('OwnPackageViewerComponent', () => {
  let component: OwnPackageViewerComponent;
  let fixture: ComponentFixture<OwnPackageViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnPackageViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnPackageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
