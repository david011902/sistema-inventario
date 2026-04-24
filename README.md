# Sistema Gestor Inventario — Frontend
Interfaz web desarrollada con **Angular** y **Angular Material** para la gestión integral de una PYME del sector LEDs. Consume la API REST del backend desplegado en Azure.
 
**Deploy:** [https://sistema-inventario.netlify.app](https://sistemagestorinventario.netlify.app)  
**Backend repo:** [https://github.com/david011902/SistemaGestorInventario](https://github.com/david011902/SistemaGestorInventario)

---
## Problema que resuelve
 
La empresa manejaba su inventario de forma manual, lo que generaba descontrol de stock y falta de visibilidad sobre ventas y adquisiciones. Este sistema centraliza la operación en una sola plataforma, permitiendo:
 
- Saber en tiempo real qué productos hay en stock y cuáles están por agotarse
- Registrar ventas y adquisiciones con trazabilidad completa
- Controlar el acceso según el rol de cada empleado
- Reducir pérdidas gracias al control de inventario 
---
## Tecnologías
 
| Capa                      | Tecnología                          |
| ------------------------- | ----------------------------------- |
| Framework                 | Angular                             |
| Angular CLI               | v21.2.5                             |
| UI Components             | Angular Material                    |
| Estilos                   | SCSS                                |
| HTTP Client               | Angular HttpClient                  |
| Autenticación             | JWT (guards e interceptor HTTP)     |
| Deploy                    | Netlify                             |

---
 ## Arquitectura
 
El proyecto está organizado por **módulos de negocio**, separando la lógica central, el acceso a datos y las vistas en capas independientes.
 
```
src/
├── app/
│   ├── core/                        # Lógica central y transversal
│   │   ├── auth/
│   │   │   ├── guards/              # Protección de rutas por rol
│   │   │   ├── interceptor/         # Interceptor HTTP para adjuntar JWT
│   │   │   ├── interfaces/          # Tipos del módulo de autenticación
│   │   │   └── services/            # Servicio de login y gestión de sesión
│   │   └── services/
│   │       ├── dialogService        # Servicio global de diálogos
│   │       ├── productService       # Lógica de productos
│   │       ├── saleService          # Lógica de ventas
│   │       └── stockService         # Lógica de stock
│   ├── data/
│   │   └── interfaces/              # Modelos e interfaces TypeScript
│   │       ├── products/            # Tipos de productos LED
│   │       ├── sales/               # Tipos de ventas
│   │       ├── stock/               # Tipos de stock
│   │       └── vehicleSocket/       # Tipo específico: sockets LED para vehículos
│   ├── modules/                     # Módulos de negocio
│   │   ├── dashboard/               # Vista principal con resumen del negocio ventas del día y productos disponibles
│   │   ├── inventory/               # Gestión de productos y stock
│   │   ├── login/                   # Autenticación de usuarios
│   │   └── sales/                   # Registro, consulta de ventas y devolución de una venta 
│   └── shared/                      # Componentes, utilidades reutilizables y barra de navegación inferior
└── environments/                    # Variables de entorno por ambiente
```
 
---
## Funcionalidades principales
 
- **Dashboard:** Vista general del estado del negocio ventas del día y productos disponibles.
- **Inventario:** Consulta, alta y actualización de productos con búsqueda por SKU y nombre.
- **Ventas:** Registro de ventas con impacto automático en el stock.
- **Autenticación:** Login con JWT, rutas protegidas por guards y roles de usuario.
- **UI adaptativa:** Interfaz responsiva con componentes de Angular Material, pensado principalmente para móvil.
  
---
 ## Configuración local
 
Crea el archivo `src/environments/environment.ts` con:
 
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000'
};
```
 
---
 
## Instalación local
 
```bash
# 1. Clonar el repositorio
git clone https://github.com/david011902/sistema-inventario
cd sistema-inventario
 
# 2. Instalar dependencias
npm install
 
# 3. Ejecutar en desarrollo
ng serve
```
 
La aplicación estará disponible en `http://localhost:4200/`
 
### Otros comandos útiles
 
```bash
# Compilar para producción
ng build
 
# Ejecutar pruebas unitarias
ng test
```
 
---
## Autor

**David Acosta**  
Ingeniero en Sistemas Computacionales  
[GitHub](https://github.com/david011902)
