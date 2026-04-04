import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StockServices } from '../../../../core/services/stock-services';

@Component({
  selector: 'app-stock-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    RouterLink,
  ],
  templateUrl: './stock-edit.html',
  styleUrl: './stock-edit.scss',
})
export class StockEdit implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private stockService = inject(StockServices);
  stockForm: FormGroup;
  stockId: string = '';

  constructor() {
    this.stockForm = this.fb.group({
      newActualQuantity: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.stockId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.stockId) {
      this.loadStock();
    }
    this.loadStock();
  }
  loadStock() {
    this.stockService.getStockById(this.stockId).subscribe((data) => {
      this.stockForm.patchValue({
        newActualQuantity: data.initialAmount,
      });
    });
  }
  onSubmit() {
    if (this.stockForm.valid) {
      const updateData = this.stockForm.value;
      this.stockService.updateStock(this.stockId, updateData).subscribe({
        next: () => {
          this.router.navigate(['/stock', this.stockId]);
        },
        error: (err) => console.error('Error al actualizar el stock', err),
      });
    }
  }
}
