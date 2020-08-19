import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StlModalComponent } from './stl-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [StlModalComponent],
  imports: [CommonModule, TranslateModule, NgbModule, ModalModule.forRoot()],
  exports: [StlModalComponent],
})
export class StlModalModule {}
