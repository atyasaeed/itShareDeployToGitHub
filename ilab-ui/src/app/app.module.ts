import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { APP_CONFIG, prodConfig } from './shared/app.config';
import { AlertComponent } from './shared/components/alert/alert.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers, effects } from './store';
import { EffectsModule } from '@ngrx/effects';
@NgModule({
  declarations: [AppComponent, AlertComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LanguageTranslationModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    EffectsModule.forRoot(effects),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    //  fakeBackendProvider,
    { provide: APP_CONFIG, useValue: prodConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
