import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { liveQuery } from 'dexie';
import { db } from './todos/services/db';
import { addTodo, getTodos } from './todos/state/todo.actions';
import { allTodos } from './todos/state/todo.selectors';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  public newTodoForm = new FormGroup({
    todo: new FormControl(null, [Validators.minLength(1), Validators.required])
  });

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(getTodos());
  }

  public addTodo(): void {
    if (this.newTodoForm.invalid) {
      return;
    }

    const text = this.newTodoForm.get('todo').value;
    this.store.dispatch(addTodo({ text }));
    this.newTodoForm.reset();
  }
}
