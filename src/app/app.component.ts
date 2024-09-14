import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  menuOptions: MenuOptions[] = MENU_OPTIONS;
}

export interface MenuOptions {
  title: string;
  icon: string;
  route: string;
  subMenu?: MenuOptions[];
  permission?: string[];
}

export const MENU_OPTIONS: MenuOptions[] = [
  {
    title: 'Empréstimos',
    icon: 'schedule',
    route: '.',
  },
  {
    title: 'Agendamentos',
    icon: 'calendar_month',
    route: '.',
  },
  {
    title: 'Registros',
    icon: 'work',
    route: '.',
  },
  {
    title: 'Relatórios',
    icon: 'description',
    route: '.',
  },
  {
    title: 'Gerenciar',
    icon: 'group_add',
    route: '/manager',
  },
];
