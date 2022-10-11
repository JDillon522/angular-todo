import { Action, createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';
import { FILTER_MODES } from './../constants/filter-modes';
import { ITodo } from '../interfaces/ITodo';
import {
  ITodoActionId, ITodoActionFilter, ITodoActionSync, ITodoActionUpdate, ITodoActionEditTodo,
  ITodoActionError, ITodoActionToggleLoading
} from '../interfaces/IActions';
import { clone, sortTodos } from '../../lib/utils';

export interface ITodosState {
  filterMode: FILTER_MODES;
  todos: ITodo[];
  errors: string;
  loading: boolean;
  streamCanceled: boolean;
}

export const initialState: ITodosState = {
  filterMode: 'All',
  todos: [],
  errors: null,
  loading: true,
  streamCanceled: false
};

export function todosReducer(state: ITodosState, action: Action) {
  return createReducer(
    initialState,
    on(TodoActions.setLoading, setLoading),
    on(TodoActions.toggleStream, toggleStream),
    on(TodoActions.syncTodos, syncTodos),
    on(TodoActions.addTodoToUi, addTodoToUi),
    on(TodoActions.editTodoUi, editTodoUi),
    on(TodoActions.markAllCompletedUi, markAllCompletedUi),
    on(TodoActions.removeTodoUi, removeTodoUi),
    on(TodoActions.changeFilterMode, changeFilterMode),
    on(TodoActions.clearCompletedUi, clearCompletedUi),
    on(TodoActions.openTodoEdit, openTodoEdit),
    on(TodoActions.genericError, genericError)
  )(state, action);
}

const setLoading = (existingState: ITodosState, { loading }: ITodoActionToggleLoading): ITodosState => {
  return {
    ...existingState,
    loading
  }
}

const toggleStream = (existingState: ITodosState): ITodosState => {
  return {
    ...existingState,
    streamCanceled: !existingState.streamCanceled
  }
}

const syncTodos = (existingState: ITodosState, { todos }: ITodoActionSync): ITodosState => {
  const sorted = clone(todos).sort(sortTodos)

  return {
    ...existingState,
    todos: sorted
  }
}

const addTodoToUi = (existingState: ITodosState, {todo}: ITodoActionUpdate): ITodosState => {
  const todos = clone(existingState.todos);
  todos.unshift(todo);

  return {
    ...existingState,
    todos: todos,
  };
}

const editTodoUi = (existingState: ITodosState, {todo}: ITodoActionUpdate): ITodosState => {
  const todos = clone(existingState.todos);
  const index = todos.findIndex(t => t.id === todo.id);

  if (index === -1) {
    return {
      ...existingState,
      errors: `Cannot edit Todo with ID: ${todo.id}.`
    }
  }

  todos[index] = todo;

  return {
    ...existingState,
    todos: todos
  };
}

const markAllCompletedUi = (existingState: ITodosState): ITodosState => {
  const todos = clone(existingState.todos);
  todos.forEach(innerTodo => {
    innerTodo.completed = true;
  });

  return {
    ...existingState,
    todos: todos,
  };
}

const removeTodoUi = (existingState: ITodosState, { id }: ITodoActionId): ITodosState => {
  const todos = clone(existingState.todos);
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return {
      ...existingState,
      errors: `Cannot delete Todo with ID: ${id}.`
    }
  }

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
    if (index === -1) {
      return {
        ...existingState,
        errors: `Cannot open Todo with ID: ${id}.`
      }
    }

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

const genericError = (existingState: ITodosState, { err }: ITodoActionError): ITodosState => {
  if (err instanceof Error) {
    err = err.message;
  }

  return {
    ...existingState,
    errors: err
  }
}
