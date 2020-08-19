import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [TranslateModule],
})
export class LanguageTranslationModule {
  constructor(private translate: TranslateService, private appStore: Store<fromStore.AppState>) {
    // Gets Default language from browser if available, otherwise set English ad default
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    const lang = browserLang.match(/en|ar/) ? browserLang : 'en';
    this.appStore.dispatch(new fromStore.UpdateLang(lang));
  }
}
