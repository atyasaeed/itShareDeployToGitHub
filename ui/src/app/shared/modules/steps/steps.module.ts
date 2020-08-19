import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsComponent } from './steps.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [StepsComponent],
  imports: [CommonModule, TranslateModule, NgbModule],
  exports: [StepsComponent],
})
export class StepsModule {}
