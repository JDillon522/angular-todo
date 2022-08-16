import { Component, Input } from '@angular/core';
import { ITodo } from '../../interfaces/ITodo';

@Component({
  selector: 'app-todos-list',
  styleUrls: [
    './todo-list.component.scss',
  ],
  templateUrl: './todo-list.component.html',
})
export class TodosListComponent {
  @Input()
  public todos: ITodo[];

  @Input()
  public message: string;

  @Input()
  public loading: boolean;
}
