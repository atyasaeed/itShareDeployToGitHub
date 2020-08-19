import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { APP_CONFIG, prodConfig } from './shared/app.config';
import { AlertComponent } from './shared/components/alert/alert.component';
import { StoreModule, Store } from '@ngrx/store';
import { reducers, metaReducers, effects, initState } from './store';
import { EffectsModule } from '@ngrx/effects';
import { ToastrModule } from 'ngx-toastr';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import * as fromStore from './store';
import { RECAPTCHA_SETTINGS, RecaptchaSettings, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
@NgModule({
  declarations: [AppComponent, AlertComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LanguageTranslationModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      // disableTimeOut: true,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true,
      closeButton: true,
      tapToDismiss: true,
    }),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    //  fakeBackendProvider,
    { provide: APP_CONFIG, useValue: prodConfig },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initApplication,
    //   multi: true,
    //   deps: [Store],
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// export function initApplication(appStore: Store<fromStore.AppState>): Function {
//   return () =>
//     new Promise((resolve) => {
//       appStore.select(fromStore.getAuthUser).subscribe((res) => {
//         console.log(res);
//         resolve(true);
//       });
//     });
// }
