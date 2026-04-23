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
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
    if (exists !== -1) {
      const item = this.items.at(exists);
      const currentQty = item.get('quantity')?.value;
      const stockAvailable = product.stock; // O la propiedad que traiga el stock

      if (currentQty < stockAvailable) {
        item.get('quantity')?.setValue(currentQty + 1);
      } else {
        this.dialogService.alert({
          title: 'Stock máximo',
          message: `No puedes agregar más de ${stockAvailable} unidades de este producto.`,
        });
      }
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
    if (this.items.length === 0) return;

    const sale = {
      items: this.items.value.map((item: any) => ({
        sku: item.sku,
        quantity: item.quantity,
      })),
    };

    this.saleService.createSale(sale).subscribe({
      next: (res) => {
        // 1. Mostrar mensaje de éxito con el Folio generado por el backend
        this.dialogService.success({
          title: 'Venta realizada',
          message: `La venta con folio ${res.folio} se ha registrado correctamente por un total de $${res.total}.`,
        });

        // 2. Limpiar el formulario
        this.saleForm.reset();
        this.items.clear();
        this.productControl.setValue('');

        // 3. Redirigir al detalle de la venta recién creada o a la lista
        this.router.navigate(['/sales/detail', res.id]);
      },
      error: (err) => {
        // Es vital manejar el error (ej. si el backend lanza la excepción de stock)
        this.dialogService.alert({
          title: 'Error en la venta',
          message: err.error?.message || 'No se pudo completar la venta. Verifique el stock.',
        });
      },
    });
  }
}
