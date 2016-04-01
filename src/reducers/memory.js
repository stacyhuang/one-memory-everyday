import * as types from '../actions/actionTypes';

// reducing function that returns the next state tree,
// given the current state tree and an action to handle
export default function memory(state, action) {
  state = state || [];

  switch (action.type) {
    case types.ADD_MEMORY:
      return state.concat(
        [{
            type: action.type,
            date: action.date,
            memory_type: action.memory_type,
            image_url: action.image_url,
            text: action.text,
            id: action.id
        }]
      )

    case types.DELETE_MEMORY:
      return state.filter(memory => {
        return memory._id !== action.id;
      });

    case types.RECEIVE_MEMORY:
      return action.memory;

    default:
      return state;
  }
}
