import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, buffer, debounceTime, fromEvent, map, Observable, tap } from 'rxjs';
import { ITodo } from '../../interfaces';
import { ITodoForm } from '../../interfaces/ITodo';
import { editTodo, openTodoEdit, removeTodo } from '../../state/todo.actions';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnChanges, AfterViewInit {
  @Input()
  public todo!: ITodo;

  public openEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild('todoLabel', { static: false })
  public todoLabel: ElementRef;

  @ViewChild('debugEditForm', { static: false })
  public debugEditForm: ElementRef;

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
    this.resetTodoForm();


  }

  ngAfterViewInit(): void {
    /**
     * TODO: Stumped on Annoying Bug:
     * It will open and close the edit on a double click, and close if another label is clicked
     * However after submitting it will not open any other edit inputs until I usually dispatch
     * another action. But even that is hit or miss.
     */
    this.click$ = fromEvent(this.todoLabel.nativeElement, 'click').pipe(
      tap(() => console.log('CLICK', this.todo.id)),
      map((val: PointerEvent) => val)
    );

    this.doubleClicked$ = this.click$.pipe(
      buffer(this.click$.pipe(debounceTime(250))),
      map((clicks: PointerEvent[]) => {
        return clicks.length;
      }),
      tap((clicks: number) => {
        this.store.dispatch(openTodoEdit({ id: null, edit: false }));

        if (clicks >= 2) {
          this.store.dispatch(openTodoEdit({ id: this.todo.id, edit: true }));
        }
      }),
      map(clicksLength => clicksLength >= 2)
    );
  }

  private resetTodoForm(): void {
    this.todoForm.setValue({
      id: this.todo.id,
      completed: this.todo?.completed || null,
      text: this.todo.text
    });
  }

  public deleteTodo(id: number) {
    this.store.dispatch(removeTodo({ id }));
  }

  public editTodo() {
    this.store.dispatch(editTodo(this.todoForm.value as ITodo));
  }
}
