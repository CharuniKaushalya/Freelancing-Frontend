import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewModelComponent } from './review-model.component';

describe('ReviewModelComponent', () => {
  let component: ReviewModelComponent;
  let fixture: ComponentFixture<ReviewModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
