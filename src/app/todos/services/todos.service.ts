import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { liveQuery } from 'dexie';
import { TodoDb } from './db';


@Injectable()
export class TodosService {

  constructor(
    private db: TodoDb
  ) { }

  public getTodosFromDb() {
    /**
     * Bizarre Bug Note:
     * I had to wrap liveQuery with the from operator because even though
     * I could subscribe to the liveQuery result, and that it was an Observable,
     * Typescript would throw the error 'The property "pipe" does not exist on type "Observable"'
     * This was the only solution I found around it.
     */
    return from(liveQuery(() => this.db.todos.toArray()));
  }

  public addTodoToDb(text: string) {
    return from(this.db.todos.add({
      text: text
    }));
  }

  public removeTodoFromDb(id: number) {
    return from(this.db.todos.delete(id));
  }
}
