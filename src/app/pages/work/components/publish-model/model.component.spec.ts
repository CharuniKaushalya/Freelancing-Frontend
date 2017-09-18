import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishModelComponent } from './model.component';

describe('PublishModelComponent', () => {
  let component: PublishModelComponent;
  let fixture: ComponentFixture<PublishModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
