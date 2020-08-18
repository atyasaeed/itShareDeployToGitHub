import { Injectable } from '@angular/core';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
@Injectable({
  providedIn: 'root',
})
export class CustomCaptchaService {
  constructor(private appStore: Store<fromStore.AppState>) {}
  //public test;
  captchaInit(emptyCaptcha) {
    if (document.getElementById('captchaSubmit') != null) {
      (<HTMLInputElement>document.getElementById('captchaSubmit')).disabled = true;
      emptyCaptcha = (<HTMLInputElement>document.getElementById('captchaSubmit')).disabled;
    }
    this.appStore.select(fromStore.getLang).subscribe((res) => {
      if (document.querySelector('.g-recaptcha') != null) {
        document.querySelector('.g-recaptcha').innerHTML = '';
        if (document.getElementById('recaptchaUrl')) {
          document.getElementById('recaptchaUrl').parentNode.removeChild(document.getElementById('recaptchaUrl'));
        }
        if (document.getElementById('recaptchaSettings')) {
          document
            .getElementById('recaptchaSettings')
            .parentNode.removeChild(document.getElementById('recaptchaSettings'));
        }
        var script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?hl=' + res;
        script.async = true;
        script.defer = true;
        script.id = 'recaptchaUrl';
        var script2 = document.createElement('script');
        script2.id = 'recaptchaSettings';
        script2.innerHTML = `
        var captchaToken ;
          var successCaptcha = function(e){
            captchaToken = e;
            document.getElementById('captchaSubmit').disabled = false;
          }
          `;
        document.querySelector('head').appendChild(script);
        document.querySelector('head').appendChild(script2);
      }
    });
  }
}
