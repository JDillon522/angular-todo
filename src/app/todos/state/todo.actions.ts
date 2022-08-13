import { createAction, props } from '@ngrx/store';
import { FILTER_MODES } from '../constants/filter-modes';
import { ITodoActionCreate, ITodoActionIndex, ITodoActionUpdate, ITodoActionFilter, ITodoActionSync } from '../interfaces/IActions';

export const getTodos = createAction(
  '[TODO] Get Todos'
);

export const addTodo = createAction(
  '[Todos] Add Todo',
  props<ITodoActionCreate>(),
);

export const syncTodos = createAction(
  '[Todos] Sync Todo state with DB',
  props<ITodoActionSync>()
)

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
