import { combineReducers } from 'redux';
import memory from './memory'
import displayTab from './displayTab'

/*
The combineReducers helper funciton turns an object whose
values are different reducing functions into a single
reducing function you can pass to createStore.

The resulting reducer calls every child reducer, and gathers
their results into a single state object.

The state object will look like this:
{
  memory: [{
      date: '2016-04-01',
      memory_type: 'photo',
      image_url: "AB4703BB-621B-41B9-A164-7EC2C8CF6E15.jpg",
      text: "Really cool waterfall!",
      _id: 1
  }],
  displayTab: 'timeline'
}
*/

export default combineReducers({
  memory,
  displayTab
})
