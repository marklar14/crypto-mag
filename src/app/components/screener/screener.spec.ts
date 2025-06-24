import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Screener } from './screener';

describe('Screener', () => {
  let component: Screener;
  let fixture: ComponentFixture<Screener>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Screener]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Screener);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
