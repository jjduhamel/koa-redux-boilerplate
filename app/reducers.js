import _ from 'underscore';
import { combineReducers } from 'redux';
import { 
  ADD_TODO,
  TOGGLE_TODO,
  REMOVE_TODO,
  SET_VISIBILITY_FILTER,
  VisibilityFilters } from './actions';
const { SHOW_ALL } = VisibilityFilters;

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}

function todo(state, action) {
  switch (action.type) {
    case ADD_TODO:
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case TOGGLE_TODO:
      if (state.id !== action.id) {
        return state;
      }
      var out = _.clone(state);
      out.completed = !state.completed;
      return out;
    default:
      return state;
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return _.flatten([ todo(undefined, action), state ]);
    case TOGGLE_TODO:
      return _.map(state, (item) => { return todo(item, action); });
    case REMOVE_TODO:
      return _.reject(state, (item) => { return item.id != action.id; });
    default:
      return state;
  }
}

export default combineReducers({
  visibilityFilter,
  todos
});
