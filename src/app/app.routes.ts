import { Routes } from '@angular/router';
import { ProductsComponent } from './modules/inventory/components/products/products';
import { ProductDetail } from './modules/inventory/components/product-detail/product-detail';
import { ProductCreate } from './modules/inventory/components/product-create/product-create';
import { StocksComponent } from './modules/inventory/components/stocks/stocks';
import { StockDetail } from './modules/inventory/components/stock-detail/stock-detail';
import { Component } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'inventario', pathMatch: 'full' },

  { path: 'inventario', component: ProductsComponent },
  { path: 'inventario/crear', component: ProductCreate },
  { path: 'inventario/detalle/:id', component: ProductDetail },
  {
    path: 'inventario/editar/:id',
    loadComponent: () =>
      import('./modules/inventory/components/product-edit/product-edit').then((m) => m.ProductEdit),
  },

  { path: 'stock', component: StocksComponent },
  {
    path: 'stock/crear',
    loadComponent: () =>
      import('./modules/inventory/components/stock-create/stock-create').then((m) => m.StockCreate),
  },
  { path: 'stock/:id', component: StockDetail },
  {
    path: 'stock/editar/:id',
    loadComponent: () =>
      import('./modules/inventory/components/stock-edit/stock-edit').then((m) => m.StockEdit),
  },
];
