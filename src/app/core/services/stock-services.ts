import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ResponseStock } from '../../data/interfaces/stock/StockResponse';
import { StockUpdate } from '../../data/interfaces/stock/stockUpdate';
import { StockCreate } from '../../data/interfaces/stock/StockCreate';

@Injectable({
  providedIn: 'root',
})
export class StockServices {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}`;

  getAllStock() {
    return this.http.get<ResponseStock[]>(`${this.baseUrl}/stock`);
  }
  getStockById(id: string) {
    return this.http.get<ResponseStock>(`${this.baseUrl}/stock/search/${id}`);
  }
  createStock(stock: StockCreate) {
    return this.http.post<ResponseStock>(`${this.baseUrl}/stock`, stock);
  }
  updateStock(id: string, stock: StockUpdate) {
    return this.http.put<ResponseStock>(`${this.baseUrl}/stock/${id}`, stock);
  }
}
