import { SaleCreate } from './../../../../data/interfaces/sales/SaleCreate';
import { Component, inject, OnInit } from '@angular/core';
import { SaleService } from '../../../../core/services/sale-service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/productService';
import { ProductResponse } from '../../../../data/interfaces/products/ProductResponse';
import { DialogService } from '../../../../core/services/dialogService';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { map, Observable, startWith } from 'rxjs';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';

@Component({
  selector: 'app-sale-create',
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
  templateUrl: './sale-create.html',
  styleUrl: './sale-create.scss',
})
export class SaleCreateComponent implements OnInit {
  private saleService = inject(SaleService);
  private productService = inject(ProductService);
  private dialogService = inject(DialogService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  saleForm: FormGroup;
  products: ProductResponse[] = [];
  filteredProducts!: Observable<ProductResponse[]>;
  productControl = new FormControl();

  //Inicializar el Form en el constructor
  constructor() {
    this.saleForm = this.fb.group({
      items: this.fb.array([]),
    });
  }

  //Getter del FormArray
  get items(): FormArray {
    return this.saleForm.get('items') as FormArray;
  }

  //Obtener productos para el autocomplete
  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this._setupProductFilter();
    });
  }
  //filtro de productos para el autocomplete
  private _setupProductFilter() {
    this.filteredProducts = this.productControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const search = typeof value === 'string' ? value : value?.name;
        return search ? this.filterProducts(search) : this.products.slice();
      }),
    );
  }
  //Metodo para el filtado de nombre o sku
  filterProducts(value: string) {
    const filterValue = value.toLowerCase();
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(filterValue) ||
        product.sku.toLowerCase().includes(filterValue),
    );
  }
  //mostrar texto del autocomplete
  displayFn(product: ProductResponse): string {
    return product && product.name ? product.name : '';
  }

  //Agregar producto a la venta
  addProduct(product: any) {
    const exists = this.items.value.find((item: any) => item.productId === product.id);
    if (exists) {
      const index = this.items.value.findIndex((item: any) => item.productId === product.id);
      const item = this.items.at(index);
      const qty = item.get('quantity')?.value;
      item.get('quantity')?.setValue(qty + 1);
      return;
    }
    this.items.push(
      this.fb.group({
        productId: [product.id, Validators.required],
        productName: [product.name],
        sku: [product.sku, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        price: [product.price, [Validators.required, Validators.min(0.01)]],
      }),
    );
  }
  //Evento del autocomplete
  onProductSelected(event: MatAutocompleteSelectedEvent) {
    const product = event.option.value;
    this.addProduct(product);
    this.productControl.setValue('');
  }
  //Eliminar producto de la venta
  removeProduct(index: number) {
    this.items.removeAt(index);
  }
  //Calcular total
  getTotal(): number {
    return this.items.value.reduce((acc: number, item: any) => acc + item.quantity * item.price, 0);
  }
  //Enviar venta
  onSubmit() {
    if (this.items.length === 0) {
      return;
    }
    const sale = {
      items: this.items.value.map((item: any) => ({
        sku: item.sku,
        quantity: item.quantity,
      })),
    };
    this.saleService.createSale(sale).subscribe(() => {
      // console.log('Venta creada');
      this.saleForm.reset();
      this.items.clear();
      this.productControl.setValue('');
      this.router.navigate(['/sales']);
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }
}
