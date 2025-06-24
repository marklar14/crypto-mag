import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerPanel } from './ticker-panel';

describe('TickerPanel', () => {
  let component: TickerPanel;
  let fixture: ComponentFixture<TickerPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TickerPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TickerPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
