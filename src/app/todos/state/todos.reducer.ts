import { Action, createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';

import { FILTER_MODES } from './../constants/filter-modes';
import { ITodo } from '../interfaces/ITodo';

export interface ITodosState {
  filterMode?: FILTER_MODES;
  todos?: ITodo[];
}

export const initialState: ITodosState = {
  filterMode: 'All',
  todos: [],
};

export function todosReducer(state: ITodosState, action: Action) {
  return createReducer(
    initialState,
    on(TodoActions.addTodo, (existingState, { text }) => ({
      ...existingState,
      todos: [{ text, completed: false }, ...existingState.todos],
    })),
    on(TodoActions.removeTodo, (existingState, { index }) => {
      const updatedTodos = [...existingState.todos];
      updatedTodos.splice(index, 1);

      return Object.assign({}, existingState, {
        todos: updatedTodos,
      } as ITodosState);
    }),
    on(TodoActions.toggleCompleted, (existingState, { index }) => {
      const todo = {...existingState.todos[index]};
      todo.completed = !todo.completed;

      return Object.assign({}, existingState, {
        todos: [...existingState.todos.slice(0, index), todo, ...existingState.todos.slice(index + 1)],
      } as ITodosState);
    }),
    on(TodoActions.updateTodo, (existingState, { index, text }) => {
      const todo = {...existingState[index]};
      todo.text = text;

      return Object.assign({}, existingState, {
        todos: [...existingState.todos.slice(0, index), todo, ...existingState.todos.slice(index + 1)],
      } as ITodosState);
    }),
    on(TodoActions.changeFilterMode, (existingState, { mode }) => ({
      ...existingState,
      filterMode: mode,
    })),
    on(TodoActions.toggleAllCompleted, (existingState) => ({
      ...existingState,
      todos: [...existingState.todos.map(todo => {
        const updatedTodo = {...todo};
        updatedTodo.completed = !updatedTodo.completed;
        return updatedTodo;
      })],
    })),
    on(TodoActions.clearCompleted, (existingState) => ({
      ...existingState,
      todos: [...existingState.todos.filter(todo => !todo.completed)],
    })),
  )(state, action);
}

export const filterMode = (state: ITodosState) => state.filterMode;
export const todos = (state: ITodosState) => state.todos;