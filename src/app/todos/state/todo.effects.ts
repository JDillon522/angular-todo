import { Injectable } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import {
  addTodo, addTodoToUi, editTodo, getTodos, markAllCompleted, removeTodo, syncTodos,
  clearCompleted, clearCompletedUi, genericError
} from './todo.actions';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { allCompletedTodos, allTodos } from './todo.selectors';

@Injectable()
export class TodosEffect {
  constructor(
    private actions$: Actions,
    private todoService: TodosService,
    private store: Store
  ) { }

  public getTodos$ = createEffect(() => this.actions$.pipe(
    ofType(getTodos),
    take(1),
    switchMap(() => this.todoService.getTodosFromDb()),
    map(todos => syncTodos({ todos })),
    catchError((err) => of({ type: genericError.type, err: err }))
  ));

  public addTodo$ = createEffect(() => this.actions$.pipe(
    ofType(addTodo),
    mergeMap((payload) => this.todoService.addTodoToDb(payload.text)),
    map((todo) => {
      return addTodoToUi(todo);
    }),
    catchError((err) => of({ type: genericError.type, err: err }))
  ));

  public removeTodo$ = createEffect(() => this.actions$.pipe(
    ofType(removeTodo),
    mergeMap((payload) => this.todoService.removeTodoFromDb(payload.id)),
    catchError((err) => of({ type: genericError.type, err: err }))
  ),
    { dispatch: false }
  );

  public removeCompleted$ = createEffect(() => this.actions$.pipe(
    ofType(clearCompleted),
    withLatestFrom(this.store.select(allCompletedTodos)),
    mergeMap(([, todos]) => {
      const completed = todos.map(todo => todo.id);
      return this.todoService.removeAllCompletedTodoFromDb(completed);
    }),
    map(() => {
      return clearCompletedUi();
    }),
    catchError((err) => of({ type: genericError.type, err: err }))
  ));

  public editTodo$ = createEffect(() => this.actions$.pipe(
    ofType(editTodo),
    mergeMap((payload) => this.todoService.updateTodoInDb(payload)),
    catchError((err) => of({ type: genericError.type, err: err }))
  ),
    { dispatch: false }
  );

  public markAllTodosComplete$ = createEffect(() => this.actions$.pipe(
    ofType(markAllCompleted),
    withLatestFrom(this.store.select(allTodos)),
    mergeMap(([, todos]) => this.todoService.markAllTodosComplete(todos)),
    catchError((err) => of({ type: genericError.type, err: err }))
  ),
    { dispatch: false }
  );
};
