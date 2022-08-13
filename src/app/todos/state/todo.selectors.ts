import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as TodosState from './todos.reducer';

export const todosSelector = createFeatureSelector<TodosState.ITodosState>('todos');

export const allTodos = createSelector(
  todosSelector,
  TodosState.todos,
);

export const filteredTodos = createSelector(
  todosSelector,
  (state: TodosState.ITodosState) => state.todos.filter(todo => {
    switch (state.filterMode) {
      case 'Active':
        return !todo.completed;

      case 'Completed':
        return todo.completed;

        default:
        return true;
    }
  })
)

export const allAreCompleted = createSelector(
  todosSelector,
  (state: TodosState.ITodosState) => state.todos.every(todo => todo.completed)
);

export const currentFilter = createSelector(
  todosSelector,
  TodosState.filterMode
);
