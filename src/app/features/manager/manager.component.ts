/*Angular Core */
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

/*Angular Material Modules*/
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/*Custom Components*/
import { AuthenticationService } from '@app/core/services/authentication.service';
import { ToolbarHeaderComponent } from '../../shared/components/toolbar-header/toolbar-header.component';
import { UsersComponent } from './users/users.component';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatProgressBarModule,
    RouterLink,
    ToolbarHeaderComponent,
    UsersComponent,
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss',
})
export class ManagerComponent {}
