import _ from 'underscore';
import React, { Component, PropTypes } from 'react';
import Todo from './Todo';

export default class TodoList extends Component {
  render() {
    return (
      <ul>
        {
          _.map(this.props.items, (item, index) => {
            return (
              <Todo {...item}
                key={ index }
                onClick={ () => this.props.onClickItem(index) }
              />
            );
          })
        }
      </ul>
    );
  }
};

TodoList.propTypes = {
  onClickItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
};
