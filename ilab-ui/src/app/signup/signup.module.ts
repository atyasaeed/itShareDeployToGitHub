import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RecaptchaModule,
  RECAPTCHA_SETTINGS,
  RecaptchaSettings,
  RecaptchaFormsModule,
  RECAPTCHA_LANGUAGE,
} from 'ng-recaptcha';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { SignupActivationComponent } from './signup-activation/signup-activation.component';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';

let test = 'ar';
@NgModule({
  declarations: [SignupComponent, SignupActivationComponent],
  imports: [
    CommonModule,
    SignupRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    SharedModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LfVQLsZAAAAAFubvZI85UgFbMcUyq57H_wVjKQk',
      } as RecaptchaSettings,
    },
    {
      provide: RECAPTCHA_LANGUAGE,
      // useValue: 'en',

      useFactory: testf,
      deps: [Store],
      multi: false,
    },
  ],
})
export class SignupModule {}

export function testf(appStore: Store<fromStore.AppState>): string {
  let language;

  new Promise((resolve) => {
    appStore.select(fromStore.getLang).subscribe((res) => {
      language = res;
      resolve(true);
    });
  });
  return language;
}
