import * as types from './actionTypes';
import DB from '../Utils/db';

export function setSelectedTab(tab) {
  return {
    type: types.SET_SELECTED_TAB,
    tab: tab
  };
}
