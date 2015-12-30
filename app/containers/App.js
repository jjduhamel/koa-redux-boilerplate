import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addTodo, toggleTodo, setVisibilityFilter, VisibilityFilters } from '../actions';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import Footer from '../components/Footer';

class App extends Component {
  render() {
    const { dispatch, visibleTodos, visibilityFilter } = this.props;
    return (
      <div id='app'>
        <AddTodo
          onSubmit={ (text) => dispatch(addTodo(text)) }
        />
        <TodoList
          onClickItem={ (index) => dispatch(toggleTodo(index)) }
          items={ visibleTodos }
        />
        <Footer
          filter={ visibilityFilter }
          onChangeFilter={ (filter) => {
            dispatch(setVisibilityFilter(filter));
          }}
        />
      </div>
    );
  }
};

App.propTypes = {
  visibleTodos: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    }).isRequired
  ).isRequired,
  visibilityFilter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired
};

function selectTodos(todos, filter) {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos;
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter( (todo) => todo.completed );
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter( (todo) => !todo.completed );
  }
}

function select(state) {
  return {
    visibleTodos: selectTodos(state.todos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  };
}

export default connect(select)(App);
