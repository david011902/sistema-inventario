import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCreate } from './stock-create';

describe('StockCreate', () => {
  let component: StockCreate;
  let fixture: ComponentFixture<StockCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(StockCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
