import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';

@Directive({ selector: '[isAuth]' })
export class IsAuthDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private appStore: Store<fromStore.AppState>
  ) {}

  ngOnInit() {
    this.appStore.select(fromStore.getAuthUser).subscribe((user) => {
      this.vcr.clear();
      this.hasView = false;
      if (user && !this.hasView) {
        this.vcr.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else {
        this.vcr.clear();
        this.hasView = false;
      }
    });
  }
}
