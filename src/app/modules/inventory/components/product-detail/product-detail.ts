import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/productService';
import { ProductResponse } from '../../../../data/interfaces/products/ProductResponse';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogService } from '../../../../core/services/dialogService';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    RouterLink,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private dialogService = inject(DialogService);

  public product?: ProductResponse;
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        // console.log('--- DATA RECIBIDA ---');
        // console.log(data);
        this.product = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar el detalle', err),
    });
  }
  goToEdit(): void {
    if (this.product?.id) {
      // Navegamos a la ruta de edición pasando el ID
      this.router.navigate(['/inventario/editar', this.product.id]);
    }
  }
  delete(id: string): void {
    this.dialogService
      .confirm({
        title: 'Eliminar producto',
        message: '¿Seguro que deseas eliminar este producto?',
        confirmText: 'Eliminar',
      })
      .subscribe((result) => {
        if (!result) return;

        this.productService.deleteProduct(id).subscribe(() => {
          this.router.navigate(['/inventario']);
        });
      });
  }
}
