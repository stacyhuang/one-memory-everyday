import { combineReducers } from 'redux';
import memory from './memory'

/*
The combineReducers helper funciton turns an object whose
values are different reducing functions into a single
reducing function you can pass to createStore.

The resulting reducer calls every child reducer, and gathers
their results into a single state object.

The state object will look like this:
{
  memory: ...
}
*/

export default combineReducers({
  memory
})
