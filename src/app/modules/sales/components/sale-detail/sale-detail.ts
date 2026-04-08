import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SaleService } from '../../../../core/services/sale-service';
import { SaleResponse } from '../../../../data/interfaces/sales/SaleResponse';

@Component({
  selector: 'app-sale-detail',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    RouterLink,
  ],
  templateUrl: './sale-detail.html',
  styleUrl: './sale-detail.scss',
})
export class SaleDetailComponent {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private saleService = inject(SaleService);

  public sale?: SaleResponse;
  ngOnInit(): void {
    const folio = this.route.snapshot.paramMap.get('folio');

    if (folio) {
      this.loadSale(folio);
    }
  }

  loadSale(folio: string): void {
    this.saleService.getSaleByFolio(folio).subscribe({
      next: (data) => {
        console.log('--- DATA RECIBIDA ---');
        console.log(data);
        this.sale = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar el detalle', err),
    });
  }

  goToEdit(): void {
    if (this.sale?.folio) {
      // Navegamos a la ruta de edición pasando el folio
      this.router.navigate(['sales/editar/', this.sale.folio]);
    }
  }
}
