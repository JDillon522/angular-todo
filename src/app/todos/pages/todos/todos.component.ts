import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, Subject, withLatestFrom, mergeMap, takeUntil } from 'rxjs';
import { FILTER_MODES } from '../../constants/filter-modes';
import { getTodos, addTodo, changeFilterMode, clearCompleted } from '../../state/todo.actions';
import { currentFilter, errors, allTodos, filteredTodos, noResultsMessage, loading, allAreCompleted } from '../../state/todo.selectors';
import { startCase } from 'lodash-es';
import { ITodo } from '../../interfaces/ITodo';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit, OnDestroy {
  // Public Streams
  public errors$: Observable<string> = this.store.select(errors);
  public hasCompletedTodos$: Observable<boolean> = this.store.select(allTodos).pipe(
    map((todos) => todos.filter(todo => todo.completed).length > 0)
  );
  public todos$: Observable<ITodo[]> = this.store.select(filteredTodos);
  public noResultsMessage$: Observable<string> = this.store.select(noResultsMessage);
  public loading$: Observable<boolean> = this.store.select(loading);
  public multipleTodosExist$: Observable<boolean> = this.store.select(allTodos).pipe(
    map(todos => todos.length > 1)
  );
  public allTodosAreSelected$: Observable<boolean> = this.store.select(allAreCompleted);

  // Private Streams
  private currentFilter$: Observable<FILTER_MODES> = this.store.select(currentFilter);
  private destroyed$ = new Subject();

  // Public objects
  public newTodoForm = new FormGroup({
    todo: new FormControl(null, [Validators.minLength(1), Validators.required])
  });

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.store.dispatch(getTodos());

    // TODO find a way to do this purely reactively
    this.route.url.pipe(
      withLatestFrom(this.currentFilter$),
      takeUntil(this.destroyed$)
    ).subscribe(([url, filter]) => {
      if (url.toString() !== filter.toLowerCase()) {
        this.store.dispatch(changeFilterMode({ mode: startCase(url) }));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }

  public addTodo(): void {
    if (this.newTodoForm.invalid) {
      return;
    }

    const text = this.newTodoForm.get('todo').value;
    this.store.dispatch(addTodo({ text }));
    this.newTodoForm.reset();
  }

  public clearCompleted(): void {
    this.store.dispatch(clearCompleted());
  }
}
