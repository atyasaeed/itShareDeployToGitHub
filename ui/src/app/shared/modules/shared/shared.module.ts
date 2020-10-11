import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableHeaderDirective } from '../../directives/sortable.directive';
import { ConfirmEqualValidatorDirective } from '../../directives/confirm-Pass';
import { IsAdminDirective } from '../../directives/isAdmin.directive';
import { arabicLangDirective } from '../../directives/arabicLang.directive';
import { englishLangDirective } from '../../directives/englishLang.directive';
import { IsAuthDirective } from '../../directives/isAuth.directive';
import { noAuthDirective } from '../../directives/noAuth.directive';
import { IsPartnerDirective } from '../../directives/isPartner.directive';
import { NotPartnerDirective } from '../../directives/notPartner.directive';

@NgModule({
  declarations: [
    SortableHeaderDirective,
    ConfirmEqualValidatorDirective,
    IsAdminDirective,
    IsAuthDirective,
    noAuthDirective,
    arabicLangDirective,
    englishLangDirective,
    IsPartnerDirective,
    NotPartnerDirective,
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
    IsPartnerDirective,
    NotPartnerDirective,
  ],
})
export class SharedModule {}
