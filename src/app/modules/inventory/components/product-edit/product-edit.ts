import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/productService';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { VehiculoSocketService } from '../../../../core/services/vehiculo-socket';
import { VehicleResponse } from '../../../../data/interfaces/vehicleSocket/VehicleResponse';
import { SocketResponse } from '../../../../data/interfaces/vehicleSocket/SocketResponse';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-product-edit',
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
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.scss',
})
export class ProductEdit implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private vehicleSocketService = inject(VehiculoSocketService);
  productForm: FormGroup;
  productId: string = '';
  vehicleTypes: VehicleResponse[] = [];
  socketTypes: SocketResponse[] = [];
  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(1)]],
      vehicleTypeId: ['', [Validators.required]],
      socketTypeId: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.productId) {
      this.loadProduct();
    }
    this.loadSocketVehicle();
  }
  loadProduct() {
    this.productService.getProductById(this.productId).subscribe((data) => {
      this.productForm.patchValue({
        name: data.name,
        price: data.price,
        vehicleTypeId: data.vehicleTypeId,
        socketTypeId: data.socketTypeId,
      });
    });
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
      this.productService.updateProduct(this.productId, updateData).subscribe({
        next: () => {
          this.router.navigate(['/inventario/detalle', this.productId]);
        },
        error: (err) => console.error('Error al actualizar', err),
      });
    }
  }
}
