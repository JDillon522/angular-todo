import { Injectable } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { addTodo, addTodoToUi, editTodo, getTodos, removeTodo, syncTodos } from './todo.actions';
import { catchError, concatMap, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';

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

  public editTodo$ = createEffect(() => this.actions$.pipe(
    ofType(editTodo),
    mergeMap((payload) => this.todoService.updateTodoInDb(payload)),
    // TODO handle event when zero rows are affected
    // catchError(err => of('ADD TODO ERROR', err))
  ),
    { dispatch: false }
  );
};
