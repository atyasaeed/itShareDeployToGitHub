import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';

@Component({
  selector: 'app-anonymous-header',
  templateUrl: './anonymous-header.component.html',
  styleUrls: ['./anonymous-header.component.scss'],
})
export class AnonymousHeaderComponent implements OnInit {
  constructor(private router: Router, private appStore: Store<fromStore.AppState>) {}
  isOpen: boolean = false;
  ngOnInit(): void {}

  signupPartner() {
    this.router.navigate(['/signup'], { queryParams: { partner: 'true' } });
  }

  changeLang(language: string) {
    this.appStore.dispatch(new fromStore.UpdateLang(language));
  }
}
