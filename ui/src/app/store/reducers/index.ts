import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  props,
} from '@ngrx/store';
import { environment } from 'src/environments/environment';
import * as fromInitstate from './initstate.reducer';
export interface AppState {
  initState: fromInitstate.InitState;
}

export const reducers: ActionReducerMap<AppState> = {
  initState: fromInitstate.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
export const initState = createFeatureSelector('initState');
export const getAuthUser = createSelector(initState, fromInitstate.getAuthUser);
export const getAuthServices = createSelector(initState, fromInitstate.getAuthServices);
export const getShoppingCart = createSelector(initState, fromInitstate.getShoppingCart);
export const getLang = createSelector(initState, fromInitstate.getLang);
export const getInitStateLoaded = createSelector(initState, fromInitstate.getInitStateLoaded);
