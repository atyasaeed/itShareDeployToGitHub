import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
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
import { FormsModule } from '@angular/forms';
import { fakeBackendProvider } from './helpers';
import { AlertComponent } from './components/alert/alert.component';
import { AuthInterceptor } from './helpers/auth-interceptor';
import { ErrorInterceptor } from './helpers/error-interceptor';
import { ServiceItemComponent } from './components/service-item/service-item.component';



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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

