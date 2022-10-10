import { Injectable } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import {
  addTodo, addTodoToUi, editTodo, getTodos, markAllCompleted, removeTodo, syncTodos,
  clearCompleted, clearCompletedUi, genericError, removeTodoUi, editTodoUi, markAllCompletedUi, setLoading, startSimulatedWebsocketConnection, noOp
} from './todo.actions';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom, delay, tap, interval, timeInterval, combineLatest, concatMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { allCompletedTodos, allTodos } from './todo.selectors';
import { sample } from 'lodash-es';
import { dummyTasks, dummyUsers } from './dummyTasks';

@Injectable()
export class TodosEffect {
  constructor(
    private actions$: Actions,
    private todoService: TodosService,
    private store: Store
  ) { }

  public getTodos$ = createEffect(() => this.actions$.pipe(
    ofType(getTodos),
    switchMap(() => this.todoService.getTodosFromDb()),
    delay(800),
    tap(() => this.store.dispatch(setLoading({ loading: false }))),
    map(todos => syncTodos({ todos })),
    catchError((err) => of({ type: genericError.type, err: err }))
  ));

  public addTodo$ = createEffect(() => this.actions$.pipe(
    ofType(addTodo),
    mergeMap((payload) => this.todoService.addTodoToDb(payload.text)),
    tap(() => this.store.dispatch(setLoading({ loading: true }))),
    delay(Math.random() * 2500),
    tap(() => this.store.dispatch(setLoading({ loading: false }))),
    map((todo) => addTodoToUi({ todo })),
    catchError((err) => of({ type: genericError.type, err: err }))
  ));

  public removeTodo$ = createEffect(() => this.actions$.pipe(
    ofType(removeTodo),
    mergeMap((payload) => this.todoService.removeTodoFromDb(payload.id)),
    map((id) => removeTodoUi({ id })),
    catchError((err) => of({ type: genericError.type, err: err }))
  ));

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
    mergeMap((payload) => this.todoService.updateTodoInDb(payload.todo)),
    map(todo => editTodoUi({ todo })),
    catchError((err) => of({ type: genericError.type, err: err })),
  ));

  public markAllTodosComplete$ = createEffect(() => this.actions$.pipe(
    ofType(markAllCompleted),
    withLatestFrom(this.store.select(allTodos)),
    mergeMap(([, todos]) => this.todoService.markAllTodosComplete(todos)),
    map(() => markAllCompletedUi()),
    catchError((err) => of({ type: genericError.type, err: err }))
  ));

  public initStreamMock$ = createEffect(() => {
    return combineLatest([
      this.actions$.pipe(
        ofType(startSimulatedWebsocketConnection)
      ),
      interval(15000)
    ]).pipe(
      timeInterval(),
      map((val) => {
        const random = Math.random() * 10;

        if (random > 5) {
          const task = sample(dummyTasks);
          const user = sample(dummyUsers);

          return addTodo({ text: `From ${user}:  ${task}`})
        }

        return noOp();
      })
    )
  });
};
