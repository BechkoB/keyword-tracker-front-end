import { Action, createReducer, on } from '@ngrx/store';
import { showLoading, hideLoading } from './actions';

export const initialState = false;

const _appReducer = createReducer(
  initialState,
  on(showLoading, (state) => (state = true)),
  on(hideLoading, (state) => (state = false))
);

export const appReducer = (state: boolean | undefined, action: Action) => {
  return _appReducer(state, action);
};
