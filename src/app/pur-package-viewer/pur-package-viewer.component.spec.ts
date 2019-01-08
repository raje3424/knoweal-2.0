import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurPackageViewerComponent } from './pur-package-viewer.component';

describe('PurPackageViewerComponent', () => {
  let component: PurPackageViewerComponent;
  let fixture: ComponentFixture<PurPackageViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurPackageViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurPackageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
