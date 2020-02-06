import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatRoutingModule } from './stat-routing.module';
import { StatComponent } from './stat.component';

@NgModule({
  declarations: [StatComponent],
  imports: [CommonModule, StatRoutingModule],
  exports: [StatComponent],
})
export class StatModule {}
