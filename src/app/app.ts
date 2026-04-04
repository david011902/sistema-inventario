import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBottom } from './shared/components/nav-bottom/nav-bottom';

@Component({
  selector: 'app-root',
  imports: [NavBottom, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('sistema-inventario');
}
