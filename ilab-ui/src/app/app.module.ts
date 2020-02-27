import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CartComponent } from './components/cart/cart.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fakeBackendProvider } from './helpers';
import { AlertComponent } from './components/alert/alert.component';
import { AuthInterceptor } from './helpers/auth-interceptor';
import { ErrorInterceptor } from './helpers/error-interceptor';
import { ServiceItemComponent } from './components/service-item/service-item.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { LineItemComponent } from './components/line-item/line-item.component';
import { APP_CONFIG, prodConfig, devConfig } from './app.config';
import { ConfirmEqualValidatorDirective } from './helpers/confirm-Pass';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule, NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@Injectable()
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingpageComponent,
    RegistrationComponent,
    CartComponent,
    TrackOrderComponent,
    CartItemComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    NavbarComponent,
    FooterComponent,
    AlertComponent,
    ServiceItemComponent,
    OrderCardComponent,
    LineItemComponent,
    ConfirmEqualValidatorDirective,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LanguageTranslationModule,
    TranslateModule,
    NgbDropdownModule,
    NgbModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    //  fakeBackendProvider,
    { provide: APP_CONFIG, useValue: prodConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
