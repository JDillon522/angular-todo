import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { buffer, debounceTime, fromEvent, map, Observable, Subject, takeUntil } from 'rxjs';
import { ITodo, ITodoForm } from '../../interfaces/ITodo';
import { editTodo, openTodoEdit, removeTodo } from '../../state/todo.actions';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnChanges, OnDestroy, AfterViewInit, AfterViewChecked {
  @Input()
  public todo!: ITodo;

  @ViewChild('todoContainer', { static: false })
  public todoContainer: ElementRef;

  @ViewChild('editInput', { static: false })
  public editInput: ElementRef;

  public click$: Observable<PointerEvent> = new Observable<PointerEvent>();

  public todoForm = new FormGroup<ITodoForm>({
    id: new FormControl(null),
    completed: new FormControl(null),
    text: new FormControl(null, [Validators.required, Validators.minLength(1)])
  });

  private destroyed$ = new Subject();

  constructor(
    private store: Store
  ) { }

  ngOnChanges(): void {
    this.todoForm.setValue({
      id: this.todo.id,
      completed: this.todo?.completed || null,
      text: this.todo.text
    });  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }

  ngAfterViewInit(): void {
    /**
     * I fought like hell to get this to be purely reactive and to avoid any
     * manual subscriptions. I ran into some weird bugs. I'll revisit at a later date
     * with fresh eyes.
     */
    this.click$ = fromEvent(this.todoContainer.nativeElement, 'click');

    this.click$.pipe(
      buffer(this.click$.pipe(debounceTime(250))),
      map((clicks: PointerEvent[]) => {
        return clicks.length;
      }),
      map(clicksLength => clicksLength >= 2),
      takeUntil(this.destroyed$)
    ).subscribe(doubleClicked => {

      // If the current todo isnt already under edit then close any open todos
      if (!this.todo.editing) {
        this.store.dispatch(openTodoEdit({ id: null, edit: false }));
      }

      if (doubleClicked) {
        this.store.dispatch(openTodoEdit({ id: this.todo.id, edit: true }));
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.editInput) {
      this.editInput.nativeElement.focus();
    }
  }

  public deleteTodo(id: number) {
    this.store.dispatch(removeTodo({ id }));
  }

  public editTodo() {
    this.store.dispatch(editTodo(this.todoForm.value as ITodo));
  }
}
