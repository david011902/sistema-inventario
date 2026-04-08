import { SaleCreate } from './data/interfaces/sales/SaleCreate';
import { Routes } from '@angular/router';
import { ProductsComponent } from './modules/inventory/components/products/products';
import { ProductDetail } from './modules/inventory/components/product-detail/product-detail';
import { ProductCreate } from './modules/inventory/components/product-create/product-create';
import { StocksComponent } from './modules/inventory/components/stocks/stocks';
import { StockDetail } from './modules/inventory/components/stock-detail/stock-detail';

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
  {
    path: 'sales',
    // Carga perezosa (Lazy Loading) - solo carga el código cuando el usuario entra
    loadComponent: () =>
      import('./modules/sales/components/sales/sales').then((m) => m.SalesComponent),
  },
  {
    path: 'sales/crear',
    loadComponent: () =>
      import('./modules/sales/components/sale-create/sale-create').then(
        (m) => m.SaleCreateComponent,
      ),
  },
  {
    path: 'sales/:folio',
    loadComponent: () =>
      import('./modules/sales/components/sale-detail/sale-detail').then(
        (m) => m.SaleDetailComponent,
      ),
  },
  {
    path: 'sales/editar/:folio',
    loadComponent: () =>
      import('./modules/sales/components/sale-return/sale-return').then((m) => m.SaleReturn),
  },
];
