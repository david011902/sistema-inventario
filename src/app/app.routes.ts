import { SaleCreate } from './data/interfaces/sales/SaleCreate';
import { Routes } from '@angular/router';
import { ProductsComponent } from './modules/inventory/components/products/products';
import { ProductDetail } from './modules/inventory/components/product-detail/product-detail';
import { ProductCreate } from './modules/inventory/components/product-create/product-create';
import { StocksComponent } from './modules/inventory/components/stocks/stocks';
import { StockDetail } from './modules/inventory/components/stock-detail/stock-detail';
import { authGuard } from './core/auth/guards/authGuard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./modules/login/login/login').then((m) => m.LoginComponent),
  },
  { path: '', redirectTo: 'inventario', pathMatch: 'full' },

  { path: 'inventario', component: ProductsComponent },
  { path: 'inventario/crear', component: ProductCreate },
  { path: 'inventario/detalle/:id', component: ProductDetail },
  {
    path: 'inventario/editar/:id',
    loadComponent: () =>
      import('./modules/inventory/components/product-edit/product-edit').then((m) => m.ProductEdit),
    canActivate: [authGuard],
  },

  { path: 'stock', component: StocksComponent },
  {
    path: 'stock/crear',
    loadComponent: () =>
      import('./modules/inventory/components/stock-create/stock-create').then((m) => m.StockCreate),
    canActivate: [authGuard],
  },
  { path: 'stock/:id', component: StockDetail },

  {
    path: 'stock/editar/:id',
    loadComponent: () =>
      import('./modules/inventory/components/stock-edit/stock-edit').then((m) => m.StockEdit),
    canActivate: [authGuard],
  },
  {
    path: 'sales',
    // Carga perezosa (Lazy Loading) - solo carga el código cuando el usuario entra
    loadComponent: () =>
      import('./modules/sales/components/sales/sales').then((m) => m.SalesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'sales/crear',
    loadComponent: () =>
      import('./modules/sales/components/sale-create/sale-create').then(
        (m) => m.SaleCreateComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'sales/:folio',
    loadComponent: () =>
      import('./modules/sales/components/sale-detail/sale-detail').then(
        (m) => m.SaleDetailComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'sales/editar/:folio',
    loadComponent: () =>
      import('./modules/sales/components/sale-return/sale-return').then((m) => m.SaleReturn),
    canActivate: [authGuard],
  },
];
