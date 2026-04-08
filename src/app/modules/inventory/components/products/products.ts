import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/productService';
import { ProductResponse } from '../../../../data/interfaces/products/ProductResponse';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-products',
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
    RouterModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent implements OnInit {
  //Inyectar el servicio
  private productService = inject(ProductService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  //variables
  public products: ProductResponse[] = [];
  public filteredProducts: ProductResponse[] = [];
  public isLoading: boolean = false;

  private currentFilterType: string = 'todos';
  public currentSearchQuery: string = '';
  constructor() {}
  ngOnInit(): void {
    this.currentFilterType = 'todos';
    this.currentSearchQuery = '';
    this.loadProducts();
  }
  //obtener productos y asignarlo a una arreglo
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
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
  public applyFilters() {
    let result = [...this.products];

    // Aplicar filtro de categoría/tipo
    if (this.currentFilterType !== 'todos') {
      switch (this.currentFilterType) {
        case 'bajo-stock':
          result = result.filter((p) => p.stock < 10);
          break;
        case 'vehiculo':
          result = result.filter((p) => p.vehicleTypeName === 'Vehículo');
          break;
        case 'motocicleta':
          result = result.filter((p) => p.vehicleTypeName === 'Motocicleta');
          break;
        case 'bicicleta':
          result = result.filter((p) => p.vehicleTypeName === 'Bicicleta');
          break;
      }
    }
    if (this.currentSearchQuery) {
      const query = this.currentSearchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) || p.vehicleTypeName.toLowerCase().includes(query),
      );
    }
    this.filteredProducts = result;
  }
  filterProducts(type: string) {
    this.currentFilterType = type;
    this.applyFilters();
  }

  calcPorcentaje(product: ProductResponse): number {
    const stockMaximo = 100;
    const porcentaje = (product.stock / stockMaximo) * 100;
    return Math.min(Math.max(porcentaje, 0), 100);
  }
  goToCreate() {
    this.router.navigate(['/inventario/crear']);
  }
}
