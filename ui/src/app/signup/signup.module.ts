import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { SignupActivationComponent } from './signup-activation/signup-activation.component';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { SignupPartnerComponent } from './signup-partner/signup-partner.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Observable, BehaviorSubject } from 'rxjs';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';

@NgModule({
  declarations: [SignupComponent, SignupActivationComponent, SignupPartnerComponent],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    SignupRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    SharedModule,
    CovalentLoadingModule,
    //RecaptchaModule,
    //RecaptchaFormsModule,
    CovalentDialogsModule,
  ],
  // providers: [
  //   {
  //     provide: RECAPTCHA_SETTINGS,
  //     useValue: {
  //       siteKey: '6LfVQLsZAAAAAFubvZI85UgFbMcUyq57H_wVjKQk',
  //     } as RecaptchaSettings,
  //   },
  // {
  //   provide: RECAPTCHA_LANGUAGE,
  //   // useValue: 'en',

  //   useFactory: testf,
  //   deps: [Store],
  //   multi: true,
  // },
  //],
})
export class SignupModule {}

// export function testf(appStore: Store<fromStore.AppState>): string {
//   let language;

//   new Promise((resolve) => {
//     appStore.select(fromStore.getLang).subscribe((res) => {
//       language = res;
//       resolve(true);
//       console.log('lang=>' + language);
//     });
//   });
//   return language;
// }
