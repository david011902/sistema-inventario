import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProductResponse } from '../../data/interfaces/products/ProductResponse';
import { ProductUpdate } from '../../data/interfaces/products/ProductUpdate';
import { ProductCreate } from '../../modules/inventory/components/product-create/product-create';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  getProducts() {
    return this.http.get<ProductResponse[]>(this.baseUrl);
  }

  getProductById(id: string) {
    return this.http.get<ProductResponse>(`${this.baseUrl}/${id}`);
  }
  getProductByNombre(nombre: string) {
    return this.http.get<ProductResponse[]>(`${this.baseUrl}/search${nombre}`);
  }
  getProductBySku(sku: string) {
    return this.http.get<ProductResponse>(`${this.baseUrl}/code{sku}`);
  }

  updateProduct(id: string, product: ProductUpdate) {
    return this.http.put<ProductResponse>(`${this.baseUrl}/${id}`, product);
  }

  createProduct(product: ProductCreate) {
    return this.http.post<ProductResponse>(this.baseUrl, product);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
