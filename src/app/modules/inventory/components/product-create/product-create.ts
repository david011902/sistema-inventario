import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/productService';
import { VehiculoSocketService } from '../../../../core/services/vehiculo-socket';
import { VehicleResponse } from '../../../../data/interfaces/vehicleSocket/VehicleResponse';
import { SocketResponse } from '../../../../data/interfaces/vehicleSocket/SocketResponse';
import { DialogService } from '../../../../core/services/dialogService';

@Component({
  selector: 'app-product-create',
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
  templateUrl: './product-create.html',
  styleUrl: './product-create.scss',
})
export class ProductCreate {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private productService = inject(ProductService);
  private vehicleSocketService = inject(VehiculoSocketService);
  private dialogService = inject(DialogService);

  productForm: FormGroup;
  vehicleTypes: VehicleResponse[] = [];
  socketTypes: SocketResponse[] = [];
  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(1)]],
      sku: ['', [Validators.required]],
      vehicleTypeId: [null, [Validators.required]],
      socketTypeId: [null],
    });
  }
  ngOnInit(): void {
    this.loadSocketVehicle();
  }

  loadSocketVehicle() {
    this.vehicleSocketService.getSocketTypes().subscribe((data) => {
      this.socketTypes = data;
    });
    this.vehicleSocketService.getVehicleTypes().subscribe((data) => {
      this.vehicleTypes = data;
    });
  }
  onSubmit() {
    if (this.productForm.valid) {
      const updateData = this.productForm.value;
      this.productService.createProduct(updateData).subscribe({
        next: (res) => {
          this.dialogService.success({
            title: 'Producto creado',
            message: `El producto ${res.name} ha sido creado exitosamente.`,
          });
          this.router.navigate(['/inventario/detalle', res.id]);
        },
        error: (err) => {
          this.dialogService.showApiError(err, 'Error al crear el producto');
        },
      });
    }
  }
}
