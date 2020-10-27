import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SentQuotationComponent } from './sent-quotation.component';

const routes: Routes = [{ path: '', component: SentQuotationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SentQuotationRoutingModule {}
