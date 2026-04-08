export interface SaleResponse {
  id: string;
  folio: string;
  date: Date;
  total: number;
  status: string;
  details: Detail[];
}

export interface Detail {
  id: string;
  quantity: number;
  priceAtSale: number;
  subtotal: number;
  productName: string;
  productSku: string;
  lotId: string;
}
