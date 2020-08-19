import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from './store';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  lang$: Observable<string>;
  constructor(private appStore: Store<fromStore.AppState>, private translate: TranslateService) {
    this.appStore.dispatch(new fromStore.LoadInitState());
    this.lang$ = appStore.select(fromStore.getLang);
  }
  ngOnInit() {
    this.lang$.subscribe((language) => {
      if (this.translate.currentLang !== language) {
        this.translate.use(language);
        if (language === 'ar') {
          document.querySelector('body').classList.add('rtl');
        } else {
          document.querySelector('body').classList.remove('rtl');
        }
      }
    });
  }
}
