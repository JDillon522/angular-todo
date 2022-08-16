import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { TodoDb } from './db';
import { ITodo } from '../interfaces/ITodo';

@Injectable()
export class TodosService {

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
}
