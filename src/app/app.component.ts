import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { liveQuery } from 'dexie';
import { Observable } from 'rxjs';
import { FILTER_MODES } from './todos/constants/filter-modes';
import { db } from './todos/services/db';
import { addTodo, changeFilterMode, clearCompleted, getTodos } from './todos/state/todo.actions';
import { allTodos, currentFilter } from './todos/state/todo.selectors';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public currentFilter$: Observable<FILTER_MODES> = this.store.select(currentFilter);

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

  public toggleFilter(filter: FILTER_MODES): void {
    this.store.dispatch(changeFilterMode({ mode: filter }));
  }

  public clearCompleted(): void {
    this.store.dispatch(clearCompleted());
  }
}
