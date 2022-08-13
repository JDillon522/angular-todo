import { createAction, props } from '@ngrx/store';
import { FILTER_MODES } from '../constants/filter-modes';
import { ITodoActionCreate, ITodoActionId, ITodoActionUpdate, ITodoActionFilter, ITodoActionSync } from '../interfaces/IActions';

export const getTodos = createAction(
  '[TODO] Get Todos'
);

export const addTodo = createAction(
  '[Todos] Add Todo to the DB',
  props<ITodoActionCreate>(),
);

export const addTodoToUi = createAction(
  '[Todos] Add Todo to the UI after saved in the DB',
  props<ITodoActionUpdate>(),
);

export const syncTodos = createAction(
  '[Todos] Sync Todo state with DB',
  props<ITodoActionSync>()
)

export const removeTodo = createAction(
  '[Todos] Remove Todo',
  props<ITodoActionId>(),
);

export const editTodo = createAction(
  '[Todos] Edit Todo',
  props<ITodoActionUpdate>(),
);

export const markAllCompleted = createAction(
  '[Todos] Mark all Todos complete'
);

export const changeFilterMode = createAction(
  '[Todos] Change Filter Mode',
  props<ITodoActionFilter>(),
);

export const clearCompleted = createAction(
  '[Todos] Clear Completed',
);
