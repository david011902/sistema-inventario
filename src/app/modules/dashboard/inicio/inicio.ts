import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/productService';
import { SaleService } from '../../../core/services/sale-service';
import { ProductResponse } from '../../../data/interfaces/products/ProductResponse';
import { SaleResponse } from '../../../data/interfaces/sales/SaleResponse';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [MatCardModule, MatTableModule, MatButtonModule, DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private salesService = inject(SaleService);
  private cdr = inject(ChangeDetectorRef);
  products: ProductResponse[] = [];
  sales: SaleResponse[] = [];
  isloadin = true;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    forkJoin({
      product: this.productService.getProducts(),
      sales: this.salesService.getSales(),
    }).subscribe({
      next: ({ product, sales }) => {
        this.products = product;
        this.sales = sales;
        this.isloadin = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando datos', err),
    });
  }
  get totalRevenue() {
    const today = new Date();
    return this.sales
      .filter((sale) => {
        const saleDate = new Date(sale.date);
        return (
          saleDate.getDate() === today.getDate() &&
          saleDate.getMonth() === today.getMonth() &&
          saleDate.getFullYear() === today.getFullYear()
        );
      })
      .reduce((acc, sale) => acc + sale.total, 0);
  }
}
