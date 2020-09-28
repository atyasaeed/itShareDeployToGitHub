import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableHeaderDirective } from '../../directives/sortable.directive';
import { ConfirmEqualValidatorDirective } from '../../directives/confirm-Pass';
import { IsAdminDirective } from '../../directives/isAdmin.directive';
import { arabicLangDirective } from '../../directives/arabicLang.directive';
import { englishLangDirective } from '../../directives/englishLang.directive';
import { IsAuthDirective } from '../../directives/isAuth.directive';
import { noAuthDirective } from '../../directives/noAuth.directive';

@NgModule({
  declarations: [
    SortableHeaderDirective,
    ConfirmEqualValidatorDirective,
    IsAdminDirective,
    IsAuthDirective,
    noAuthDirective,
    arabicLangDirective,
    englishLangDirective,
  ],
  imports: [CommonModule],
  exports: [
    SortableHeaderDirective,
    ConfirmEqualValidatorDirective,
    IsAdminDirective,
    IsAuthDirective,
    noAuthDirective,
    arabicLangDirective,
    englishLangDirective,
  ],
})
export class SharedModule {}
