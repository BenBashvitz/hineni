import { Route } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ScannerComponent } from './scanner/scanner.component';

export const appRoutes: Route[] = [
  {
    path: 'register/86',
    component: RegisterComponent,
  },
  {
    path: 'scanner',
    component: ScannerComponent,
  },
];
