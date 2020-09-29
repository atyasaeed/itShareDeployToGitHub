import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';

@Directive({ selector: '[arabicLang]' })
export class arabicLangDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private appStore: Store<fromStore.AppState>
  ) {}

  ngOnInit() {
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.vcr.clear();
      this.hasView = false;
      if (lang === 'ar' && !this.hasView) {
        this.vcr.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else {
        this.vcr.clear();
        this.hasView = false;
      }
    });
  }
}
