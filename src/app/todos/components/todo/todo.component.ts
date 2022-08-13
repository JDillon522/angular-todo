import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, buffer, combineLatest, debounceTime, filter, forkJoin, fromEvent, map, Observable, Subject, tap } from 'rxjs';
import { ITodo } from '../../interfaces';
import { ITodoForm } from '../../interfaces/ITodo';
import { editTodo, openTodoEdit, removeTodo } from '../../state/todo.actions';
import { editingATodo } from '../../state/todo.selectors';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnChanges, AfterViewInit {
  @Input()
  public todo!: ITodo;
  @Input()
  public todoThatIsUnderEdit: number = null;

  public openEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild('todoLabel', { static: false })
  public todoLabel: ElementRef;

  public click$: Observable<PointerEvent> = new Observable<PointerEvent>();
  public doubleClicked$: Observable<boolean> = new Observable<boolean>();

  public todoForm = new FormGroup<ITodoForm>({
    id: new FormControl(null),
    completed: new FormControl(null),
    text: new FormControl(null, [Validators.required, Validators.minLength(1)])
  });

  constructor(
    private store: Store
  ) { }

  ngOnChanges(): void {
    this.todoForm.setValue({
      id: this.todo.id,
      completed: this.todo?.completed || null,
      text: this.todo.text
    });

    if (this.todo && this.todoThatIsUnderEdit) {
      this.openEdit$.next(this.todoThatIsUnderEdit === this.todo.id);
    }
  }

  ngAfterViewInit(): void {
    if (this.todoLabel) {

      this.click$ = fromEvent(this.todoLabel.nativeElement, 'click');

      this.doubleClicked$ = this.click$.pipe(
          buffer(this.click$.pipe(debounceTime(250))),
          map((clicks: PointerEvent[]) => {
            return clicks.length;
          }),
          tap((clicks: number) => {
            if (clicks >= 2) {
              this.store.dispatch(openTodoEdit({ id: this.todo.id }));
            }
          }),
          map(clicksLength => clicksLength >= 2),
        );
    }
  }

  public deleteTodo(id: number) {
    this.store.dispatch(removeTodo({ id }));
  }

  public toggleComplete() {
    this.store.dispatch(editTodo(this.todoForm.value as ITodo));
  }
}
