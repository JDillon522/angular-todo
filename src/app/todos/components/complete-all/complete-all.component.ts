import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { TodosService } from '@app/todos/services/todos.service';
import { Store } from '@ngrx/store';
import { allAreCompleted, allTodos } from '../../state/todo.selectors';
import { markAllCompleted } from '../../state/todo.actions';
import { ITodo } from '../../interfaces/ITodo';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-complete-all',
  styleUrls: [
    './complete-all.component.scss',
  ],
  templateUrl: './complete-all.component.html',
})
export class CompleteAllComponent {
  @Input()
  public allSelected: boolean;

  @Input()
  public multipleTodosExist: boolean;

  constructor (
    private store: Store
  ) {}

  public toggleCompleteAll(): void {
    this.store.dispatch(markAllCompleted());
  }

}
