import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RfqListComponent } from './rfq-list.component';

const routes: Routes = [{ path: '', component: RfqListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RfqListRoutingModule {}
