import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RUDComponent } from './rud.component';

describe('RUDComponent', () => {
  let component: RUDComponent;
  let fixture: ComponentFixture<RUDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RUDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
