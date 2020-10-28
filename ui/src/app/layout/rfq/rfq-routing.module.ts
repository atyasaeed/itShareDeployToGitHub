import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RfqComponent } from './rfq.component';

const routes: Routes = [{ path: '', component: RfqComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RfqRoutingModule {}
