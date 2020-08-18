import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as initStateActions from '../actions/initstate.action';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { InitState } from '../reducers/initstate.reducer';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
@Injectable()
export class InitStateEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private appConfig: IAppConfig
  ) {}
  @Effect()
  initState$ = this.actions$.pipe(
    ofType(initStateActions.LOAD_INIT_STATE),
    switchMap(() => {
      return this.httpClient.get<InitState>(this.appConfig.INIT_STATE_URL).pipe(
        map((initstate) => new initStateActions.LoadInitStateSuccess(initstate)),
        catchError((error) => of(new initStateActions.LoadInitStateFail(error)))
      );
    })
  );
  @Effect()
  lang$ = this.actions$.pipe(
    ofType(initStateActions.UPDATE_LANG),
    switchMap((action: initStateActions.UpdateLang) => {
      return this.httpClient.put<InitState>(this.appConfig.CHANGE_LANG_URL + '?lang=' + action.payload, '').pipe(
        map((profile) => new initStateActions.LoadInitStateSuccess(profile)),
        catchError((error) => of(new initStateActions.LoadInitStateFail(error)))
      );
    })
  );
}
