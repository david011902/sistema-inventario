import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturn } from './sale-return';

describe('SaleReturn', () => {
  let component: SaleReturn;
  let fixture: ComponentFixture<SaleReturn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleReturn],
    }).compileComponents();

    fixture = TestBed.createComponent(SaleReturn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
