import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ITodo } from '../../interfaces/ITodo';
import { filteredTodos, noResultsMessage } from '../../state/todo.selectors';

@Component({
  selector: 'app-todos-list',
  styleUrls: [
    './todo-list.component.scss',
  ],
  templateUrl: './todo-list.component.html',
})
export class TodosListComponent {
  public todos$: Observable<ITodo[]> = this.store.select(filteredTodos);
  public noResultsMessage$: Observable<string> = this.store.select(noResultsMessage);

  constructor(
    private store: Store
  ) {}
}
