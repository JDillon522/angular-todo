import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TodosService } from './todos/services/todos.service';
import { connectToTodoStream, startSimulatedWebsocketConnection } from './todos/state/todo.actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store,
    private service: TodosService
  ) { }

  ngOnInit(): void {
    // this.store.dispatch(startSimulatedWebsocketConnection());
    this.store.dispatch(connectToTodoStream());
  }
}
