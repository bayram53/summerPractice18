import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadInboxComponent } from './read-inbox.component';

describe('ReadInboxComponent', () => {
  let component: ReadInboxComponent;
  let fixture: ComponentFixture<ReadInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
