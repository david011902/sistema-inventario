import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SaleService } from '../../../../core/services/sale-service';
import { SaleResponse } from '../../../../data/interfaces/sales/SaleResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales',
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './sales.html',
  styleUrl: './sales.scss',
})
export class SalesComponent implements OnInit {
  private saleService = inject(SaleService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  //variables
  public sales: SaleResponse[] = [];
  public filteredProducts: SaleResponse[] = [];
  public isLoading: boolean = false;
  public searchTerm: string = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.saleService.getSales().subscribe({
      next: (data) => {
        this.sales = data;
        this.filteredProducts = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
      },
    });
  }
  get filteredAndSortedStocks() {
    return this.sales
      .filter((item) =>
        // Buscador por nombre de producto
        item.folio.toLowerCase().includes(this.searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        // Ordenar por fecha (de más reciente a más antiguo)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }
  goToCreate() {
    this.router.navigate(['/sales/crear']);
  }
}
