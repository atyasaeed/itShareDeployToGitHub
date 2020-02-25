import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MachinesRoutingModule } from './machines-routing.module';
import { MachinesComponent } from './machines.component';


@NgModule({
  declarations: [MachinesComponent],
  imports: [
    CommonModule,
    MachinesRoutingModule
  ]
})
export class MachinesModule { }
