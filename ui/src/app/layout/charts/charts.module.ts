import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts.component';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';

@NgModule({
  declarations: [ChartsComponent],
  imports: [CommonModule, ChartsRoutingModule, PageHeaderModule, Ng2Charts],
})
export class ChartsModule {}
