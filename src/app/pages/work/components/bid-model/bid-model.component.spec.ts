import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidModelComponent } from './bid-model.component';

describe('BidModelComponent', () => {
  let component: BidModelComponent;
  let fixture: ComponentFixture<BidModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
