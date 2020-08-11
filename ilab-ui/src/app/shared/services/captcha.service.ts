import { Injectable } from '@angular/core';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
@Injectable({
  providedIn: 'root',
})
export class CustomCaptchaService {
  constructor(private appStore: Store<fromStore.AppState>) {}

  captchaInit(emptyCaptcha) {
    if (document.getElementById('captchaSubmit') != null) {
      (<HTMLInputElement>document.getElementById('captchaSubmit')).disabled = true;
      emptyCaptcha = (<HTMLInputElement>document.getElementById('captchaSubmit')).disabled;
    }
    this.appStore.select(fromStore.getLang).subscribe((res) => {
      if (document.querySelector('.g-recaptcha') != null) {
        document.querySelector('.g-recaptcha').innerHTML = '';
        if (document.querySelector('.captchaSection')) {
          document.querySelector('.captchaSection').innerHTML = '';
        } else {
          var captchaSection = document.createElement('div');
          captchaSection.className = 'captchaSection';
          document.querySelector('head').appendChild(captchaSection);
        }
        var script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?hl=' + res;
        script.async = true;
        script.defer = true;
        var script2 = document.createElement('script');
        script2.innerHTML = `
          var successCaptcha = function(e){
            console.log(e);
            document.getElementById('captchaSubmit').disabled = false;
          }
          `;

        document.querySelector('.captchaSection').appendChild(script);
        document.querySelector('.captchaSection').appendChild(script2);
      }
    });
  }
}
