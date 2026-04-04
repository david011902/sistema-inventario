import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockEdit } from './stock-edit';

describe('StockEdit', () => {
  let component: StockEdit;
  let fixture: ComponentFixture<StockEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(StockEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
