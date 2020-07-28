import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReasonsListRoutingModule } from './reasons-list-routing.module';
import { ReasonsListComponent } from './reasons-list.component';
import { ReasonsFormComponent } from './reasons-form/reasons-form.component';

@NgModule({
  declarations: [ReasonsListComponent, ReasonsFormComponent],
  imports: [CommonModule, ReasonsListRoutingModule],
})
export class ReasonsListModule {}
