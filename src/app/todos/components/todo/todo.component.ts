import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { clone } from '../../../lib/utils';
import { ITodo } from '../../interfaces';
import { editTodo, removeTodo } from '../../state/todo.actions';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnChanges {
  @Input()
  public todo!: ITodo;

  public todoForm = new FormGroup({
    completed: new FormControl(null)
  });

  constructor(
    private store: Store
  ) {}

  ngOnChanges(): void {
    this.todoForm.setValue({ completed: this.todo?.completed || null });
  }

  public deleteTodo(id: number) {
    this.store.dispatch(removeTodo({ id }));
  }

  public toggleComplete() {
    const todo = clone(this.todo);
    todo.completed = this.todoForm.value.completed;
    this.store.dispatch(editTodo(todo));
  }
}
