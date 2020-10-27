import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcceptQuotationComponent } from './accept-quotation.component';

const routes: Routes = [{ path: '', component: AcceptQuotationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcceptQuotationRoutingModule {}
