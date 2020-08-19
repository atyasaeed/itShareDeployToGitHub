import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CovalentLoadingModule } from '@covalent/core/loading';

@NgModule({
  declarations: [LayoutComponent, HeaderComponent, SidebarComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    TranslateModule,
    MatIconModule,
    MatBadgeModule,
    BsDropdownModule.forRoot(),
    CovalentLoadingModule,
  ],
})
export class LayoutModule {}
