import { Component, OnInit } from '@angular/core';

import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {RouterLink} from "@angular/router";


import { AuthenticationService } from '@app/core/services/authentication.service';
import { CommonModule } from '@angular/common';
import { ToolbarHeaderComponent } from "../../shared/components/toolbar-header/toolbar-header.component";

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatProgressBarModule,
    RouterLink,
    ToolbarHeaderComponent
],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss'
})
export class ManagerComponent implements OnInit {

  constructor(private readonly _authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this._authService.login('gustavo.garcia1', 'password1')
  }

}
