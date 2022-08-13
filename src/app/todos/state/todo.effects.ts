import { Injectable } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { addTodo, getTodos, removeTodo, syncTodos } from './todo.actions';
import { catchError, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
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
    )
  );

  public addTodo$ =  createEffect(() => this.actions$.pipe(
      ofType(addTodo),
      mergeMap((payload) => this.todoService.addTodoToDb(payload.text)),
      map(() => getTodos()),
      // catchError(err => of('ADD TODO ERROR', err))
    )
  );

  public removeTodo$ =  createEffect(() => this.actions$.pipe(
    ofType(removeTodo),
    mergeMap((payload) => this.todoService.removeTodoFromDb(payload.index)),
    map(() => getTodos()),
    // catchError(err => of('ADD TODO ERROR', err))
  )
);
};
