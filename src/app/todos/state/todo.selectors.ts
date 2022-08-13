import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ITodosState } from './todos.reducer';

export const todosSelector = createFeatureSelector<ITodosState>('todos');

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

