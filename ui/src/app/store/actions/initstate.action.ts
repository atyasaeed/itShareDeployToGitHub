import { Action } from 'ngx-bootstrap';
import { InitState } from '../reducers/initstate.reducer';
import { User, ShoppingCartItem, Order } from 'src/app/shared/domain';

export const LOAD_INIT_STATE = '[InitState] Load';
export const LOAD_INIT_STATE_SUCCESS = '[InitState] Load Success';
export const LOAD_INIT_STATE_FAIL = '[InitState] Load Fail';
export const UPDATE_AUTH_USER = '[AuthService] Update User';
export const UPDATE_LANG = '[Translate] update language';
export const UPDATE_LINE_ITEM_QUANTITY = '[InitState] Update Quantity';

export class LoadInitState implements Action {
  readonly type = LOAD_INIT_STATE;
}
export class LoadInitStateFail implements Action {
  readonly type = LOAD_INIT_STATE_FAIL;
  constructor(public payload: any) {}
}
export class LoadInitStateSuccess implements Action {
  readonly type = LOAD_INIT_STATE_SUCCESS;
  constructor(public payload: InitState) {}
}
export class UpdateAuthUser implements Action {
  readonly type = UPDATE_AUTH_USER;
  constructor(public payload: User) {}
}
export class UpdateLang implements Action {
  readonly type = UPDATE_LANG;
  constructor(public payload: string) {}
}

export class UpdateLineItemQuantity implements Action {
  readonly type = UPDATE_LINE_ITEM_QUANTITY;
  constructor(public payload: ShoppingCartItem) {}
}

export type InitStateAction =
  | LoadInitState
  | LoadInitStateFail
  | LoadInitStateSuccess
  | UpdateAuthUser
  | UpdateLang
  | UpdateLineItemQuantity;
