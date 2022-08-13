import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { ITodo } from '../interfaces';

@Injectable()
export class TodoDb extends Dexie {
  public todos!: Table<ITodo, number>;

  constructor() {
    super('labCorpTodos');
    this.version(3).stores({
      todos: '++id'
    });
    this.on('populate', () => this.populate());
  }

  private async populate() {
    await db.todos.add({
      text: 'This is a seed todo',
      completed: false,
      editing: false
    });

  }
}

export const db = new TodoDb();
