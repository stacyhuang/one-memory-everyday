import React, { Component } from 'react-native';
import { Provider } from 'react-redux';
import createStore from '../store/configureStore'
import App from './App';

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

const store = createStore();

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}
