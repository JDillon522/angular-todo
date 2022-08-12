import { createAction, props } from '@ngrx/store';
import { FILTER_MODES } from '../constants/filter-modes';

export interface ITodoActionIndex {
  index: number;
}

export interface ITodoActionCreate {
  text: string;
}

export interface ITodoActionUpdate {
  index: number;
  text: string;
}

export interface ITodoActionFilter {
  mode: FILTER_MODES;
}

export const addTodo = createAction(
  '[Todos] Add Todo',
  props<ITodoActionCreate>(),
);

export const removeTodo = createAction(
  '[Todos] Remove Todo',
  props<ITodoActionIndex>(),
);

export const editTodo = createAction(
  '[Todos] Edit Todo',
  props<ITodoActionIndex>(),
);

export const updateTodo = createAction(
  '[Todos] Update Todo',
  props<ITodoActionUpdate>(),
);

export const toggleCompleted = createAction(
  '[Todos] Toggle Completed',
  props<ITodoActionIndex>(),
);

export const toggleAllCompleted = createAction(
  '[Todos] Toggle All Completed',
);

export const changeFilterMode = createAction(
  '[Todos] Change Filter Mode',
  props<ITodoActionFilter>(),
);

export const clearCompleted = createAction(
  '[Todos] Clear Completed',
);
