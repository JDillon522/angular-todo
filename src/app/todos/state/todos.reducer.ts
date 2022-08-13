import { Action, createReducer, on, ActionCreator } from '@ngrx/store';
import * as TodoActions from './todo.actions';

import { FILTER_MODES } from './../constants/filter-modes';
import { ITodo } from '../interfaces/ITodo';
import { ITodoActionCreate, ITodoActionId, ITodoActionFilter, ITodoActionSync, ITodoActionUpdate, ITodoActionEditTodo } from '../interfaces/IActions';
import { clone, sortTodos } from '../../lib/utils';

export interface ITodosState {
  filterMode: FILTER_MODES;
  todos: ITodo[];
}

export const initialState: ITodosState = {
  filterMode: 'All',
  todos: []
};

export function todosReducer(state: ITodosState, action: Action) {
  return createReducer(
    initialState,
    on(TodoActions.syncTodos, syncTodos),
    on(TodoActions.addTodoToUi, addTodoToUi),
    on(TodoActions.editTodo, editTodo),
    on(TodoActions.markAllCompleted, markAllCompleted),
    on(TodoActions.removeTodo, removeTodo),
    on(TodoActions.changeFilterMode, changeFilterMode),
    on(TodoActions.clearCompletedUi, clearCompletedUi),
    on(TodoActions.openTodoEdit, openTodoEdit)
  )(state, action);
}

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
  const index = todos.findIndex(t => t.id === todo.id);
  todos[index] = todo;

  return {
    ...existingState,
    todos: todos
  };
}

const markAllCompleted = (existingState: ITodosState): ITodosState => {
  const todos = clone(existingState.todos);
  todos.forEach(innerTodo => {
    innerTodo.completed = true;
  });

  return {
    ...existingState,
    todos: todos,
  };
}


const removeTodo = (existingState: ITodosState, { id }: ITodoActionId): ITodosState => {
  const todos = clone(existingState.todos);
  const index = todos.findIndex(t => t.id === id);
  todos.splice(index, 1);

  return {
    ...existingState,
    todos: todos,
  };
}

const changeFilterMode = (existingState: ITodosState, { mode }: ITodoActionFilter): ITodosState => {
  return {
    ...existingState,
    filterMode: mode,
  };
}

const openTodoEdit = (existingState: ITodosState, { id, edit }: ITodoActionEditTodo): ITodosState => {
  const todos = clone(existingState.todos);

  if (edit) {
    const index = todos.findIndex(t => t.id === id);
    todos[index].editing = edit;
  } else {
    todos.forEach(todo => todo.editing = false);
  }

  return {
    ...existingState,
    todos
  };
}

const clearCompletedUi = (existingState: ITodosState): ITodosState => {
  return {
    ...existingState,
    todos: [...existingState.todos.filter(todo => !todo.completed)],
  };
}
