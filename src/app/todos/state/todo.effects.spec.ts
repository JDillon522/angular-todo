import { TestBed } from "@angular/core/testing";
import { Action } from "@ngrx/store";
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { firstValueFrom, Observable, of } from "rxjs";
import { TodosService } from "../services/todos.service";
import { MOCK_INITIAL_STATE, MOCK_NEW_TODO, MOCK_TODOS } from "./testing/mocks";
import { TodosEffect } from "./todo.effects";
import { initialState } from "./todos.reducer";
import { addTodo, addTodoToUi, editTodo, editTodoUi, genericError, getTodos, markAllCompleted, markAllCompletedUi, removeTodo, removeTodoUi, syncTodos } from "./todo.actions";


describe('Effects', () => {
  let effect: TodosEffect;
  let actions$ = new Observable<Action>();
  let spy;
  const newTodoWithId = {...MOCK_NEW_TODO, id: 8675309 };
  const removeTodoIndex = MOCK_TODOS[0].id;
  const afterEditTodo = { ...MOCK_TODOS[0], completed: true };

  beforeEach(() => {
    spy = jasmine.createSpyObj('TodosService', [
      'getTodosFromDb',
      'addTodoToDb',
      'removeTodoFromDb',
      'updateTodoInDb',
      'markAllTodosComplete'
    ]);
    const stub = MOCK_TODOS;
    spy.getTodosFromDb.and.returnValue(of(stub));
    spy.addTodoToDb.and.returnValue(of(newTodoWithId));
    spy.removeTodoFromDb.and.returnValue(of(removeTodoIndex));
    spy.updateTodoInDb.and.returnValue(of(afterEditTodo));
    spy.markAllTodosComplete.and.returnValue(of(3));

    TestBed.configureTestingModule({
      providers: [
        TodosEffect,
        provideMockActions(() => actions$),
        { provide: TodosService, useValue: spy },
        provideMockStore({
          initialState: MOCK_INITIAL_STATE
        })
      ]
    });

    effect = TestBed.inject<TodosEffect>(TodosEffect);
  })


  it('Should return all todos from "getTodos"', async (done) => {
    actions$ = of(getTodos());

    const result = await firstValueFrom(effect.getTodos$)

    expect(result).toEqual({
      type: syncTodos.type,
      todos: MOCK_TODOS
    });

    done();
  });

  it('Should properly handle adding a todo', async (done) => {
    actions$ = of(addTodo({ text: MOCK_NEW_TODO.text }));

    const result = await firstValueFrom(effect.addTodo$);
    expect(result).toEqual({
      type: addTodoToUi.type,
      todo: newTodoWithId
    });

    done();
  });

  it('Should properly remove a Todo', async (done) => {
    actions$ = of(removeTodo({ id: removeTodoIndex }));

    const result = await firstValueFrom(effect.removeTodo$);
    expect(result).toEqual({
      type: removeTodoUi.type,
      id: removeTodoIndex
    });

    done();
  });

  it('Should properly edit a Todo', async (done) => {
    actions$ = of(editTodo({ todo: afterEditTodo }));

    const result = await firstValueFrom(effect.editTodo$);
    expect(result).toEqual({
      type: editTodoUi.type,
      todo: afterEditTodo
    });

    done();
  });

  it('Should mark all completed', async (done) => {
    actions$ = of(markAllCompleted());

    const result = await firstValueFrom(effect.markAllTodosComplete$);
    expect(result).toEqual({
      type: markAllCompletedUi.type
    });

    done();
  });
});
