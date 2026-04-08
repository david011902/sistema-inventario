export interface SaleCreate {
  items: Item[];
}

export interface Item {
  sku: string;
  quantity: number;
}
