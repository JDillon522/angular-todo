import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { FILTER_MODES } from './todos/constants/filter-modes';
import { addTodo, changeFilterMode, clearCompleted, getTodos } from './todos/state/todo.actions';
import { allTodos, currentFilter, errors } from './todos/state/todo.selectors';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public currentFilter$: Observable<FILTER_MODES> = this.store.select(currentFilter);
  public errors$: Observable<string> = this.store.select(errors);
  public hasCompletedTodos$: Observable<boolean> = this.store.select(allTodos).pipe(
    map((todos) => todos.filter(todo => todo.completed).length > 0)
  );

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
