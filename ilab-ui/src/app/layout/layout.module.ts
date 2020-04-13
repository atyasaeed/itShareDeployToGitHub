import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
@NgModule({
  declarations: [LayoutComponent, HeaderComponent, SidebarComponent],
  imports: [CommonModule, LayoutRoutingModule, TranslateModule, BsDropdownModule.forRoot()],
})
export class LayoutModule {}
