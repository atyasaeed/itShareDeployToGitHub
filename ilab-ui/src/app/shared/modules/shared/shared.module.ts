import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableHeaderDirective } from '../../directives/sortable.directive';
import { ConfirmEqualValidatorDirective } from '../../directives/confirm-Pass';

@NgModule({
  declarations: [SortableHeaderDirective, ConfirmEqualValidatorDirective],
  imports: [CommonModule],
  exports: [SortableHeaderDirective, ConfirmEqualValidatorDirective],
})
export class SharedModule {}
