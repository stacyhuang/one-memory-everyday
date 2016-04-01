import * as types from './actionTypes';
import DB from '../Utils/db';

export function addMemory(memory) {
  return {
    type: types.ADD_MEMORY,
    date: memory.date,
    memory_type: memory.memory_type,
    image_url: memory.image_url,
    text: memory.text,
    id: memory._id
  };
}

export function addToDB(memory) {
  return dispatch => {
    return DB.memories.add(memory)
      .then(memory => {
        dispatch(addMemory(memory))
      })
  }
}

export function deleteMemory(id) {
  return {
    type: types.DELETE_MEMORY,
    id
  };
}

export function deleteFromDB(id) {
  return dispatch => {
    return DB.memories.removeById(id)
    .then(memory => {
      dispatch(deleteMemory(memory._id))
    });
  }
}

export function receiveMemory(memory) {
  return {
    type: types.RECEIVE_MEMORY,
    memory: memory
  }
}

export function fetchFromDB(memory) {
  return dispatch => {
    return DB.memories.find()
      .then((res) => {
        if (res === null) {
          dispatch(receiveMemory([]))
        } else {
          dispatch(receiveMemory(res))
        }
      });
  }
}
