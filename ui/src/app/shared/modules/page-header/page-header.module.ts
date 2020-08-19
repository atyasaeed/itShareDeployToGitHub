import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from './page-header.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PageHeaderComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [PageHeaderComponent],
})
export class PageHeaderModule {}
