import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

/*
createStore creates a Redux store that holds the complete
state tree of our app

Middleware supports asynchronous actions by letting us
dispatch async actions.

Redux Thunk middleware allows you to write action creators
that return a function instead of an action. The thunk can
be used to delay the dispatch of an action, or to dispatch
only if a certain condition is met. The iner function receives
the store methods dispatch and getState() as parameters.
*/

export default function configureStore(initialState) {
  return createStore(
    reducer,
    initialState,
    applyMiddleware(thunk)
  );
}
