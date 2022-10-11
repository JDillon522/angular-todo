import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ITodosState } from './todos.reducer';

export const todosSelector = createFeatureSelector<ITodosState>('todos');

export const loading = createSelector(
  todosSelector,
  (state: ITodosState) => state.loading
);

export const streamStatus = createSelector(
  todosSelector,
  (state: ITodosState) => state.streamCanceled
);

export const allTodos = createSelector(
  todosSelector,
  (state: ITodosState) => state.todos
);

export const filteredTodos = createSelector(
  todosSelector,
  (state: ITodosState) => state.todos.filter(todo => {
    switch (state.filterMode) {
      case 'Active':
        return !todo.completed;

      case 'Completed':
        return todo.completed;

        default:
        return true;
    }
  })
);

export const allCompletedTodos = createSelector(
  todosSelector,
  (state: ITodosState) => state.todos.filter(todo => todo.completed)
);

export const allAreCompleted = createSelector(
  todosSelector,
  (state: ITodosState) => state.todos.every(todo => todo.completed)
);

export const currentFilter = createSelector(
  todosSelector,
  (state: ITodosState) => state.filterMode
);

export const noResultsMessage = createSelector(
  todosSelector,
  (state: ITodosState) => {
    switch (state.filterMode) {
      case 'Active':
        return 'No Todos in your queue. Good job!';

      case 'Completed':
        return 'Looks like you\'re out of Todos!... \nOr you need to get to work...';

      default:
        return 'Looks like you need more work...';
    }
  }
);

export const errors = createSelector(
  todosSelector,
  (state: ITodosState) => state.errors
);
