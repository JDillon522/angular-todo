import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { TodosService } from '@app/todos/services/todos.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-complete-all',
  styleUrls: [
    './complete-all.component.scss',
  ],
  templateUrl: './complete-all.component.html',
})
export class CompleteAllComponent implements OnInit {

  multipleTodosExist = false;

  constructor (
    private changeDetectorRef: ChangeDetectorRef,
    private todosService: TodosService,
  ) {}

  ngOnInit(): void {
    // this.subscription = this.todosService.allTodos$.subscribe(todos => {
    //   this.multipleTodosExist = todos && todos.length > 1;
    //   this.changeDetectorRef.markForCheck();
    // });
  }

  toggleCompleteAll(): void {
    // this.todosService.toggleAllCompleted();
  }

}
