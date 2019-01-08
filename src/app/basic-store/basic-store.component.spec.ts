import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicStoreComponent } from './basic-store.component';

describe('BasicStoreComponent', () => {
  let component: BasicStoreComponent;
  let fixture: ComponentFixture<BasicStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
