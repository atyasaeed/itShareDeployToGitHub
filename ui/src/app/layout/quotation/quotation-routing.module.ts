import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotationComponent } from './quotation.component';

const routes: Routes = [
  {
    path: '',
    component: QuotationComponent,
    children: [
      { path: '', redirectTo: 'sent', pathMatch: 'prefix' },
      {
        path: 'sent',
        loadChildren: () => import('./sent-quotation/sent-quotation.module').then((m) => m.SentQuotationModule),
      },
      {
        path: 'accept',
        loadChildren: () => import('./accept-quotation/accept-quotation.module').then((m) => m.AcceptQuotationModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotationRoutingModule {}
