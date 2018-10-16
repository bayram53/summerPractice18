import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOutboxComponent } from './read-outbox.component';

describe('ReadOutboxComponent', () => {
  let component: ReadOutboxComponent;
  let fixture: ComponentFixture<ReadOutboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadOutboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadOutboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
