import { Injectable } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { addTodo, addTodoToUi, editTodo, getTodos, markAllCompleted, removeTodo, syncTodos, clearCompleted, clearCompletedUi } from './todo.actions';
import { catchError, concatMap, from, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
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
    switchMap(() => this.todoService.getTodosFromDb().pipe(
      map(todos => syncTodos({ todos }),
        // catchError(err => of('GET TODOS ERROR', err))
      ))
    )
  ));

  public addTodo$ = createEffect(() => this.actions$.pipe(
    ofType(addTodo),
    mergeMap((payload) => this.todoService.addTodoToDb(payload.text)),
    map((todo) => {
      return addTodoToUi(todo);
    }),
    // catchError(err => of('ADD TODO ERROR', err))
  ));

  public removeTodo$ = createEffect(() => this.actions$.pipe(
    ofType(removeTodo),
    mergeMap((payload) => this.todoService.removeTodoFromDb(payload.id)),
    // catchError(err => of('ADD TODO ERROR', err))
  ),
    { dispatch: false }
  );

  public removeCompleted$ = createEffect(() => this.actions$.pipe(
    ofType(clearCompleted),
    withLatestFrom(this.store.select(allCompletedTodos)),
    mergeMap(([, todos]) => this.todoService.removeAllCompletedTodoFromDb(todos.map(todo => todo.id))),
    map(() => {
      return clearCompletedUi();
    })
    // catchError(err => of('ADD TODO ERROR', err))
  ));

  public editTodo$ = createEffect(() => this.actions$.pipe(
    ofType(editTodo),
    mergeMap((payload) => this.todoService.updateTodoInDb(payload)),
    // TODO handle event when zero rows are affected
    // catchError(err => of('ADD TODO ERROR', err))
  ),
    { dispatch: false }
  );

  public markAllTodosComplete$ = createEffect(() => this.actions$.pipe(
    ofType(markAllCompleted),
    withLatestFrom(this.store.select(allTodos)),
    mergeMap(([, todos]) => this.todoService.markAllTodosComplete(todos)),
    // TODO handle event when zero rows are affected
    // catchError(err => of('ADD TODO ERROR', err))
  ),
    { dispatch: false }
  );
};
