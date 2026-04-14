import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SaleResponse } from '../../data/interfaces/sales/SaleResponse';
import { SaleUpdate } from '../../data/interfaces/sales/SaleUpdate';
import { SaleCreate } from '../../data/interfaces/sales/SaleCreate';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/sales`;

  getSales() {
    return this.http.get<SaleResponse[]>(this.baseUrl);
  }

  getSaleByFolio(folio: string) {
    return this.http.get<SaleResponse>(`${this.baseUrl}/folios/${folio}`);
  }

  updateSale(folio: string, sale: SaleUpdate[]) {
    return this.http.put<SaleResponse>(`${this.baseUrl}/folio/${folio}`, sale);
  }

  createSale(sale: SaleCreate) {
    return this.http.post<SaleResponse>(this.baseUrl, sale);
  }
}
