import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SaleService } from '../../../../core/services/sale-service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { SaleResponse } from '../../../../data/interfaces/sales/SaleResponse';
import { SaleUpdate } from '../../../../data/interfaces/sales/SaleUpdate';

@Component({
  selector: 'app-sale-return',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './sale-return.html',
  styleUrl: './sale-return.scss',
})
export class SaleReturn implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private saleService = inject(SaleService);
  private cdr = inject(ChangeDetectorRef);
  quantityMap: { [sku: string]: number } = {};
  saleResponse?: SaleResponse;
  saleFolio: string = '';
  saleForm: FormGroup;
  isLodading: boolean = false;

  constructor() {
    this.saleForm = this.fb.group({
      productSku: ['', [Validators.required]],
      quantityToReturn: [1, [Validators.required, Validators.min(1)]],
    });
    this.saleForm.get('productSku')?.valueChanges.subscribe((sku) => {
      this.updateQuantityValidators(sku);
    });
  }
  //Para ajustar el valor permitido a devolver
  private updateQuantityValidators(sku: string) {
    const item = this.saleResponse?.details.find((i) => i.productSku === sku);
    const quantityControl = this.saleForm.get('quantityToReturn');

    if (item && quantityControl) {
      quantityControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(item.quantity), // El límite es lo que se vendió
      ]);
    } else {
      quantityControl?.setValidators([Validators.required, Validators.min(1)]);
    }
    quantityControl?.updateValueAndValidity();
  }
  //obtener venta con el folio
  getSale() {
    this.saleService.getSaleByFolio(this.saleFolio).subscribe({
      next: (data) => {
        this.saleResponse = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('No se pudo obtener la venta', err);
      },
    });
  }

  ngOnInit(): void {
    this.saleFolio = this.route.snapshot.paramMap.get('folio') ?? '';
    if (this.saleFolio) {
      this.getSale();
    }
  }
  onSubmit() {
    if (this.saleForm.invalid || !this.saleResponse) {
      return;
    }
    const refund: SaleUpdate = this.saleForm.value;
    const dataUpdate: SaleUpdate[] = [refund];
    this.isLodading = true;
    this.saleService.updateSale(this.saleFolio, dataUpdate).subscribe({
      next: () => {
        console.log('Devolución procesada correctamente', refund);
        this.saleForm.reset();
        this.getSale();
        this.router.navigate(['/sales']);
      },
      error: (err) => {
        this.isLodading = false;
        console.error('Error al procesar la devolución', err);
      },
    });
  }
}
