import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_CONFIG, prodConfig } from './app.config';
import { AuthGuard } from './shared/guard/auth.guard';
import { AuthInterceptor } from './shared/helpers/auth-interceptor';
import { ErrorInterceptor } from './shared/helpers/error-interceptor';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { AuthenticationService } from './shared/services/authentication.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule, LanguageTranslationModule],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    //  fakeBackendProvider,
    { provide: APP_CONFIG, useValue: prodConfig },
    AuthenticationService,
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
