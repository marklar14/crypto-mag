import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerCardSkeleton } from './ticker-card-skeleton';

describe('TickerCardSkeleton', () => {
  let component: TickerCardSkeleton;
  let fixture: ComponentFixture<TickerCardSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TickerCardSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TickerCardSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
