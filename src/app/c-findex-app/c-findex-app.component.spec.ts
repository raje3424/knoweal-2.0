import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CFIndexAppComponent } from './c-findex-app.component';

describe('CFIndexAppComponent', () => {
  let component: CFIndexAppComponent;
  let fixture: ComponentFixture<CFIndexAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CFIndexAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CFIndexAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
