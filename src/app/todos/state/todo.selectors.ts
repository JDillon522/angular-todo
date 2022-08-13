import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as TodosState from './todos.reducer';

export const todosSelector = createFeatureSelector<TodosState.ITodosState>('todos');

export const allTodos = createSelector(
  todosSelector,
  TodosState.todos,
);

export const allAreCompleted = createSelector(
  todosSelector,
  (state: TodosState.ITodosState) => state.todos.every(todo => todo.completed)
);
