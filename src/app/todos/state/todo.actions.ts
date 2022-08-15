import { createAction, props } from '@ngrx/store';
import {
  ITodoActionCreate, ITodoActionId, ITodoActionUpdate, ITodoActionFilter,
  ITodoActionSync, ITodoActionEditTodo, ITodoActionError
} from '../interfaces/IActions';

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
  '[Todos] Remove Todo from the DB',
  props<ITodoActionId>(),
);

export const removeTodoUi = createAction(
  '[Todos] Remove Todo from the UI',
  props<ITodoActionId>(),
);

export const editTodo = createAction(
  '[Todos] Edit Todo in the DB',
  props<ITodoActionUpdate>(),
);

export const editTodoUi = createAction(
  '[Todos] Edit Todo and update the UI',
  props<ITodoActionUpdate>(),
);

export const markAllCompleted = createAction(
  '[Todos] Mark all Todos complete in the DB'
);

export const markAllCompletedUi = createAction(
  '[Todos] Mark all Todos complete in the UI'
);

export const changeFilterMode = createAction(
  '[Todos] Change Filter Mode',
  props<ITodoActionFilter>(),
);

export const clearCompleted = createAction(
  '[Todos] Clear Completed in the DB',
);

export const clearCompletedUi = createAction(
  '[Todos] Clear Completed in the UI',
);

export const openTodoEdit = createAction(
  '[Todos] Open a todo for edits',
  props<ITodoActionEditTodo>()
);

export const genericError = createAction(
  '[Todo ERROR] Generic error',
  props<ITodoActionError>()
);
