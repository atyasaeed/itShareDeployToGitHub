import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StlModalComponent } from './stl-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [StlModalComponent],
  imports: [CommonModule, TranslateModule, NgbModule],
  exports: [StlModalComponent],
})
export class StlModalModule {}
