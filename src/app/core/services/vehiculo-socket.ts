import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { VehicleResponse } from '../../data/interfaces/vehicleSocket/VehicleResponse';
import { SocketResponse } from '../../data/interfaces/vehicleSocket/SocketResponse';

@Injectable({
  providedIn: 'root',
})
export class VehiculoSocketService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getVehicleTypes() {
    return this.http.get<VehicleResponse[]>(`${this.baseUrl}/vehicletypes`);
  }
  getSocketTypes() {
    return this.http.get<SocketResponse[]>(`${this.baseUrl}/sockettypes`);
  }
}
