import * as types from '../actions/actionTypes';

// reducing function that returns the next state tree,
// given the current state tree and an action to handle
export default function displayTab(state, action) {
  state = state || 'timeline';

  switch (action.type) {
    case types.SET_SELECTED_TAB:
      return action.tab;

    default:
      return state;
  }
}
