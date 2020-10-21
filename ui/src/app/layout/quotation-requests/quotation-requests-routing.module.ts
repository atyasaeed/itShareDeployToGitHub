import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotationRequestsComponent } from './quotation-requests.component';

const routes: Routes = [{ path: '', component: QuotationRequestsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotationRequestsRoutingModule {}
