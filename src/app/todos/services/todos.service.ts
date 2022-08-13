import { Injectable } from '@angular/core';
import { from, map, Observable, tap } from 'rxjs';
import { liveQuery } from 'dexie';
import { TodoDb } from './db';
import { ITodo } from '../interfaces';


@Injectable()
export class TodosService {

  constructor(
    private db: TodoDb
  ) { }

  public getTodosFromDb() {
    return from(this.db.todos.toArray());
  }

  public addTodoToDb(text: string): Observable<ITodo> {
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

  public updateTodoInDb(todo: ITodo): Observable<number> {
    delete todo.editing;

    return from(this.db.todos.update(todo.id, todo)).pipe(
      map(numAffected => numAffected)
    );
  }

  public markAllTodosComplete(todos: ITodo[]): Observable<number> {
    return from(this.db.todos.bulkPut(todos)).pipe(
      map(numAffected => numAffected)
    );
  }

  public removeTodoFromDb(id: number): Observable<number> {
    return from(this.db.todos.delete(id)).pipe(
      map(() => id)
    );
  }

  public removeAllCompletedTodoFromDb(ids: number[]): Observable<number> {
    return from(this.db.todos.bulkDelete(ids)).pipe(
      map(() => 5)
    );
  }
}
