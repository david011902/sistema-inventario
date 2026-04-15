import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StockServices } from '../../../../core/services/stock-services';
import { ResponseStock } from '../../../../data/interfaces/stock/StockResponse';

@Component({
  selector: 'app-stock-detail',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    RouterLink,
  ],
  templateUrl: './stock-detail.html',
  styleUrl: './stock-detail.scss',
})
export class StockDetail {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private stockService = inject(StockServices);

  public stock?: ResponseStock;
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadStock(id);
    }
  }

  loadStock(id: string): void {
    this.stockService.getStockById(id).subscribe({
      next: (data) => {
        // console.log('--- DATA RECIBIDA ---');
        // console.log(data);
        this.stock = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar el detalle', err),
    });
  }

  goToEdit(): void {
    if (this.stock?.id) {
      // Navegamos a la ruta de edición pasando el ID
      this.router.navigate(['/stock/editar', this.stock.id]);
    }
  }
}
