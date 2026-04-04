export interface ResponseStock {
  id: string;
  productId: string;
  initialAmount: number;
  currentAmount: number;
  purchaseCost: number;
  arrivateDate: Date;
  supplier: string;
  isActive: boolean;
  product: Product;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  vehicleTypeId: string;
  vehicleTypeName: Type;
  socketTypeId: string;
  socketTypeName: Type;
  isActive: boolean;
  deletedAt: null;
  lots: null[];
  stock: number;
  saleDetails: any[];
}

export interface Type {
  id: string;
  nameSocket?: string;
  isActive: boolean;
  deletedAt: null;
  nameVehicle?: string;
}
