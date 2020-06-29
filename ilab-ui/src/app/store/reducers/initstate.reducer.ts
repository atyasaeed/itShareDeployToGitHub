import * as fromInitState from '../actions';
import { initState } from '.';
import { Order, User, Service, ShoppingCartItem } from 'src/app/shared/domain';

export interface InitState {
  shoppingCart: Order;
  shoppingCartItem: ShoppingCartItem;
  lang: string;
  user: User;
  services: Service[];
  loaded: boolean;
  loading: boolean;
}
export function reducer(state: InitState, action: fromInitState.InitStateAction): InitState {
  switch (action.type) {
    case fromInitState.LOAD_INIT_STATE:
      return { ...state, loading: true };
    case fromInitState.LOAD_INIT_STATE_SUCCESS:
      console.log(action.payload);
      return { ...state, ...action.payload, loading: false, loaded: true };
    case fromInitState.LOAD_INIT_STATE_FAIL:
      return { ...state, loading: false, loaded: false };
    case fromInitState.UPDATE_AUTH_USER:
      return { ...state, user: action.payload };
    case fromInitState.UPDATE_LANG:
      return { ...state, lang: action.payload };
    case fromInitState.UPDATE_LINE_ITEM_QUANTITY:
      // const shoppingCartItem = state.shoppingCart[action.payload.id];
      // const updatedShoppingCartItem = {
      //   ...shoppingCartItem,
      //   ...action.payload.shoppingCartItem,
      // };
      // const updatedShoppingCart = [...state.shoppingCart.lineItems];
      // updatedShoppingCart[action.payload.id] = updatedShoppingCartItem;

      // return {
      //   ...state,
      //   // shoppingCartItem: updatedShoppingCart,
      // };
      return { ...state, shoppingCartItem: action.payload };

    default:
      return state;
  }
}

export const getInitStateLoading = (state: InitState) => state.loading;
export const getInitStateLoaded = (state: InitState) => state.loaded;

export const isAuthenitcated = (state: InitState) => state.user !== null;
export const getAuthUser = (state: InitState) => state.user;
export const getAuthServices = (state: InitState) => state.services;
export const getShoppingCart = (state: InitState) => state.shoppingCart;

export const getLang = (state: InitState) => {
  return state.lang;
};
