import { Action, createReducer, on, ActionCreator } from '@ngrx/store';
import * as TodoActions from './todo.actions';

import { FILTER_MODES } from './../constants/filter-modes';
import { ITodo } from '../interfaces/ITodo';
import { ITodoActionCreate, ITodoActionId, ITodoActionFilter, ITodoActionSync, ITodoActionUpdate } from '../interfaces/IActions';
import { clone, sortTodos } from '../../lib/utils';

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
    on(TodoActions.syncTodos, syncTodos),
    on(TodoActions.addTodoToUi, addTodoToUi),
    on(TodoActions.editTodo, editTodo),
    on(TodoActions.removeTodo, removeTodo),
    on(TodoActions.changeFilterMode, changeFilterMode),
    on(TodoActions.clearCompleted, clearCompleted),
  )(state, action);
}

export const filterMode = (state: ITodosState) => state.filterMode;
export const todos = (state: ITodosState) => state.todos;

const syncTodos = (existingState: ITodosState, { todos }: ITodoActionSync): ITodosState => {
  const sorted = clone(todos).sort(sortTodos)

  return {
    ...existingState,
    todos: sorted
  }
}

const addTodoToUi = (existingState: ITodosState, todo: ITodoActionUpdate): ITodosState => {
  const todos = clone(existingState.todos);
  todos.unshift(todo);

  return {
    ...existingState,
    todos: todos,
  };
}

const editTodo = (existingState: ITodosState, todo: ITodoActionUpdate): ITodosState => {
  const todos = clone(existingState.todos);
  todos.forEach(innerTodo => {
    if (innerTodo.id === todo.id) {
      innerTodo = todo;
    }
  });

  return {
    ...existingState,
    todos: todos,
  };
}

const removeTodo = (existingState: ITodosState, { id }: ITodoActionId): ITodosState => {
  const updatedTodos = clone(existingState.todos);
  updatedTodos.splice(id, 1);

  return {
    ...existingState,
    todos: updatedTodos,
  };
}

const changeFilterMode = (existingState: ITodosState, { mode }: ITodoActionFilter): ITodosState => {
  return {
    ...existingState,
    filterMode: mode,
  };
}

const clearCompleted = (existingState: ITodosState): ITodosState => {
  return {
    ...existingState,
    todos: [...existingState.todos.filter(todo => !todo.completed)],
  };
}
