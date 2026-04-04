import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { StockServices } from '../../../../core/services/stock-services';
import { ProductService } from '../../../../core/services/productService';
import { ProductResponse } from '../../../../data/interfaces/products/ProductResponse';
import { Observable, startWith, map } from 'rxjs';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-stock-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    RouterLink,
  ],
  templateUrl: './stock-create.html',
  styleUrl: './stock-create.scss',
})
export class StockCreate {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private stockService = inject(StockServices);
  private productService = inject(ProductService);
  stockForm: FormGroup;
  products: ProductResponse[] = [];
  filteredProducts!: Observable<ProductResponse[]>;
  constructor() {
    this.stockForm = this.fb.group({
      productId: ['', [Validators.required]],
      initialAmount: [0, [Validators.required, Validators.min(1)]],
      purchaseCost: [0, [Validators.required, Validators.min(0.01)]],
      supplier: [''],
    });
  }
  ngOnInit(): void {
    this.loadProducts();
    this._setupProductFilter();
  }
  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }
  private _setupProductFilter(): void {
    const productControl = this.stockForm.get('productId');

    if (productControl) {
      this.filteredProducts = productControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          // Si el valor es un string (lo que escribe el usuario) o un objeto (lo seleccionado)
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name) : this.products.slice();
        }),
      );
    }
  }

  private _filter(name: string): ProductResponse[] {
    const filterValue = name.toLowerCase();
    return this.products.filter((option) => option.name.toLowerCase().includes(filterValue));
  }

  displayFn(product: ProductResponse): string {
    return product && product.name ? product.name : '';
  }
  onSubmit() {
    if (this.stockForm.valid) {
      const stockData = this.stockForm.value;
      const dataToSend = {
        ...stockData,
        productId: stockData.productId.id, // Suponiendo que el objeto tiene la propiedad .id
      };
      this.stockService.createStock(dataToSend).subscribe({
        next: (res) => {
          this.router.navigate(['/stock', res.id]);
        },
        error: (err) => console.error('Error al crear el stock', err),
      });
    }
  }
}
