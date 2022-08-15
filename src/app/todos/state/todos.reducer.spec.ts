import { todosReducer } from './todos.reducer';
import { addTodoToUi, changeFilterMode, clearCompletedUi, editTodo, editTodoUi, genericError, markAllCompleted, markAllCompletedUi, openTodoEdit, removeTodo, removeTodoUi, syncTodos } from './todo.actions';
import { clone } from '@app/lib/utils';
import { ITodo } from '../interfaces/ITodo';
import { MOCK_INITIAL_STATE, MOCK_NEW_TODO, MOCK_TODOS, MOCK_TODOS_SORTED } from './testing/mocks';

describe('Todos Reducer', () => {
  const initialState = MOCK_INITIAL_STATE;
  let initialStateWithTodos = {...initialState, todos: MOCK_TODOS};

  beforeEach(() => {
    initialStateWithTodos = clone({...initialState, todos: MOCK_TODOS});
  });

  describe('Get Todos', () => {
    it('Should sync all the todos from IndexDB', () => {
      const newState = {...initialState, todos: MOCK_TODOS_SORTED};
      const action = syncTodos({ todos: MOCK_TODOS });
      const state = todosReducer(initialState, action);
      expect(state).toEqual(newState);
    });
  });

  describe('Add Todos', () => {
    it('Should add Todo to the state', () => {
      const newTodo: ITodo = MOCK_NEW_TODO;
      newTodo.id = 8675309;

      const newState = {
        ...initialStateWithTodos,
        todos: [ newTodo, ...MOCK_TODOS]
      };
      const action = addTodoToUi({ todo: newTodo });
      const state = todosReducer(initialStateWithTodos, action);

      expect(state.todos.length).toEqual(newState.todos.length);
      expect(state.todos[0].id).toBe(newState.todos[0].id);
    });
  });

  describe('Edit Todos', () => {
    it('Should edit a Todo', () => {
      const updated: ITodo = clone(MOCK_TODOS[0]);
      updated.completed = true;
      updated.text = 'Once more into the breach';
      updated.editing = true;

      const newState = {...initialStateWithTodos};
      newState.todos[0] = updated;

      const action = editTodoUi({ todo: updated });
      const state = todosReducer(initialStateWithTodos, action);

      expect(state.todos[0].completed).toEqual(newState.todos[0].completed);
      expect(state.todos[0].text).toEqual(newState.todos[0].text);
      expect(state.todos[0].editing).toEqual(newState.todos[0].editing);
    });

    it('Should mark all Todos Complete', () => {
      const action = markAllCompletedUi();
      const state = todosReducer(initialStateWithTodos, action);

      state.todos.forEach(todo => {
        expect(todo.completed).toBeTrue();
      });
    });

    it('Should open Todo for editing correctly', () => {
      let compareTodo = initialStateWithTodos.todos[0];
      let action = openTodoEdit({ id: compareTodo.id, edit: true });
      let state = todosReducer(initialStateWithTodos, action);

      expect(state.todos[0].editing).toBeTrue();
      expect(state.todos[1].editing).toBeFalse();
      expect(state.todos[2].editing).toBeFalse();

      action = openTodoEdit({ id: null, edit: false });
      state = todosReducer(initialStateWithTodos, action);

      state.todos.forEach(todo => {
        expect(todo.editing).toBeFalse();
      });
    });

    it('Should set error if Todo doesnt exist', () => {
      const updated: ITodo = clone(MOCK_TODOS[0]);
      updated.id = 123;

      const action = editTodoUi({ todo: updated});
      const state = todosReducer(initialStateWithTodos, action);
      expect(state.errors).toEqual('Cannot edit Todo with ID: 123.');
    });

    it('Should set error while opening a Todo for editing if Todo doesnt exist', () => {
      const action = openTodoEdit({ id: 123, edit: true });
      const state = todosReducer(initialStateWithTodos, action);
      expect(state.errors).toEqual('Cannot open Todo with ID: 123.');
    });
  });

  describe('Remove Todos', () => {
    it('Should remove a single todo', () => {
      const action = removeTodoUi({ id: 1 });
      const state = todosReducer(initialStateWithTodos, action);
      const deletedTodo = state.todos.find(todo => todo.id === 1);

      expect(state.todos.length).toBe(2);
      expect(deletedTodo).toBeUndefined();
    });

    it('Should set an error if the Todo doesnt exist', () => {
      const action = removeTodoUi({ id: 123 });
      const state = todosReducer(initialStateWithTodos, action);

      expect(state.todos.length).toBe(3);
      expect(state.errors).toBe('Cannot delete Todo with ID: 123.')
    });

    it('Should clear all completed Todos', () => {
      let updated: ITodo = clone(MOCK_TODOS[0]);
      updated.completed = true;

      let updateAction = editTodoUi({ todo: updated });
      let state = todosReducer(initialStateWithTodos, updateAction);

      updated = clone(MOCK_TODOS[1]);
      updated.completed = true;

      updateAction = editTodoUi({ todo: updated });
      state = todosReducer(state, updateAction);

      const clearAction = clearCompletedUi();
      state = todosReducer(state, clearAction);

      expect(state.todos.length).toBe(1);
    });
  });

  describe('Filter Mode', () => {
    it('Should change the filter mode', () => {
      const action = changeFilterMode({ mode: 'Completed' });
      const state = todosReducer(initialStateWithTodos, action);

      expect(state.filterMode).toBe('Completed');
    });
  });

  describe('Errors', () => {
    it('Should handle string errors', () => {
      const err = 'This is an error';
      const action = genericError({ err: err });
      const state = todosReducer(initialStateWithTodos, action);
      expect(state.errors).toEqual(err);
    });

    it('Should handle Error constructor', () => {
      const err = 'This is an error';
      const action = genericError({ err: new Error(err) });
      const state = todosReducer(initialStateWithTodos, action);
      expect(state.errors).toEqual(err);
    });
  });
});
