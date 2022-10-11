import { Injectable } from '@angular/core';
import { BehaviorSubject, delayWhen, from, map, Observable, of, retry, retryWhen, Subject, take, takeUntil, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { TodoDb } from './db';
import { ITodo } from '../interfaces/ITodo';
import { environment } from '../../../environments/environment';

@Injectable()
export class TodosService {
  private streamUrl = environment.production ? 'wss://dummy-todo-ws.herokuapp.com/' : 'ws://localhost:3000';
  public websocketStream: WebSocketSubject<any> = webSocket<{ text: string }>(this.streamUrl);
  private cancelStream$$ = new Subject();

  constructor(
    private db: TodoDb
  ) { }

  public getTodosFromDb() {
    return from(this.db.todos.toArray());
  }

  public addTodoToDb(text: string): Observable<ITodo> {
    if (!text) {
      throw new Error('Invalid request');
    }

    const todo: ITodo = {
      text: text,
      completed: false
    };
    return from(this.db.todos.add(todo)).pipe(
      map(id => {
        todo.id = id;
        return todo;
      })
    );
  }

  public updateTodoInDb(todo: ITodo): Observable<ITodo> {
    if (!todo) {
      throw new Error('Invalid request');
    }

    delete todo.editing;

    return from(this.db.todos.update(todo.id, todo)).pipe(
      map(() => todo)
    );
  }

  public markAllTodosComplete(todos: ITodo[]): Observable<number> {
    if (!todos?.length) {
      throw new Error('Invalid request');
    }

    return from(this.db.todos.bulkPut(todos)).pipe(
      map(numAffected => numAffected)
    );
  }

  public removeTodoFromDb(id: number): Observable<number> {
    if (!id) {
      throw new Error('Invalid request');
    }

    return from(this.db.todos.delete(id)).pipe(
      map(() => id)
    );
  }

  public removeAllCompletedTodoFromDb(ids: number[]): Observable<number> {
    if (!ids?.length) {
      throw new Error('Invalid request');
    }

    return from(this.db.todos.bulkDelete(ids)).pipe(
      map(() => 5)
    );
  }

  public toggleStream(cancelStream: boolean): Observable<boolean> {
    if (cancelStream) {
      this.cancelStream$$.next({});
      this.cancelStream$$.complete();
    } else {
      this.cancelStream$$ = new BehaviorSubject(false);
    }

    return of(cancelStream);
  }

  public getTodosFromStream(): Observable<string> {
    this.websocketStream.next({ event: 'events', data: {} })
    return this.websocketStream.pipe(
      map(res => res.data?.text),
      takeUntil(this.cancelStream$$)
    );
  }

  public checkForDuplicateTodos(todo: string, todos: ITodo[]): Observable<[ITodo | null, string]> {
    return of([todos.find(t => t.text === todo), todo]);
  }
}
