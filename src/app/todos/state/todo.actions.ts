import { createAction, props } from '@ngrx/store';
import {
  ITodoActionCreate, ITodoActionId, ITodoActionUpdate, ITodoActionFilter,
  ITodoActionSync, ITodoActionEditTodo, ITodoActionError, ITodoActionToggleLoading
} from '../interfaces/IActions';

export const startSimulatedWebsocketConnection = createAction(
  '[TODO] start the interval that mocks a websocket connection'
);

export const setLoading = createAction(
  '[TODO] Set loading status',
  props<ITodoActionToggleLoading>()
);

export const getTodos = createAction(
  '[TODO] Get Todos'
);

export const addTodo = createAction(
  '[TODO] Add Todo to the DB',
  props<ITodoActionCreate>(),
);

export const addTodoToUi = createAction(
  '[TODO] Add Todo to the UI after saved in the DB',
  props<ITodoActionUpdate>(),
);

export const syncTodos = createAction(
  '[TODO] Sync Todo state with DB',
  props<ITodoActionSync>()
)

export const removeTodo = createAction(
  '[TODO] Remove Todo from the DB',
  props<ITodoActionId>(),
);

export const removeTodoUi = createAction(
  '[TODO] Remove Todo from the UI',
  props<ITodoActionId>(),
);

export const editTodo = createAction(
  '[TODO] Edit Todo in the DB',
  props<ITodoActionUpdate>(),
);

export const editTodoUi = createAction(
  '[TODO] Edit Todo and update the UI',
  props<ITodoActionUpdate>(),
);

export const markAllCompleted = createAction(
  '[TODO] Mark all Todos complete in the DB'
);

export const markAllCompletedUi = createAction(
  '[TODO] Mark all Todos complete in the UI'
);

export const changeFilterMode = createAction(
  '[TODO] Change Filter Mode',
  props<ITodoActionFilter>(),
);

export const clearCompleted = createAction(
  '[TODO] Clear Completed in the DB',
);

export const clearCompletedUi = createAction(
  '[TODO] Clear Completed in the UI',
);

export const openTodoEdit = createAction(
  '[TODO] Open a todo for edits',
  props<ITodoActionEditTodo>()
);

export const genericError = createAction(
  '[TODO ERROR] Generic error',
  props<ITodoActionError>()
);

export const noOp = createAction(
  '[UTILITY] noop'
);
