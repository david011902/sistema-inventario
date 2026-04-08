import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { StockServices } from '../../../../core/services/stock-services';
import { ResponseStock } from '../../../../data/interfaces/stock/StockResponse';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock-detail',
  imports: [
    FormsModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './stocks.html',
  styleUrl: './stocks.scss',
})
export class StocksComponent implements OnInit {
  private router = inject(Router);
  private stockService = inject(StockServices);
  private cdr = inject(ChangeDetectorRef);
  public stocks: ResponseStock[] = [];
  public searchTerm: string = '';
  public isLoading: boolean = false;

  ngOnInit(): void {
    this.loadStocks();
  }
  get filteredAndSortedStocks() {
    return this.stocks
      .filter((item) =>
        // Buscador por nombre de producto
        item.product.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        // Ordenar por fecha (de más reciente a más antiguo)
        return new Date(b.arrivateDate).getTime() - new Date(a.arrivateDate).getTime();
      });
  }
  loadStocks(): void {
    this.isLoading = true;
    this.stockService.getAllStock().subscribe({
      next: (data) => {
        this.stocks = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
      },
    });
  }
  calcPorcentaje(stock: ResponseStock): number {
    const stockMaximo = 100;
    const porcentaje = (stock.currentAmount / stockMaximo) * 100;
    return Math.min(Math.max(porcentaje, 0), 100);
  }
  goToCreate() {
    this.router.navigate(['/stock/crear']);
  }
}
