import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonGridRows } from './skeleton-table-rows';

describe('SkeletonGridRows', () => {
  let component: SkeletonGridRows;
  let fixture: ComponentFixture<SkeletonGridRows>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonGridRows],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonGridRows);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
