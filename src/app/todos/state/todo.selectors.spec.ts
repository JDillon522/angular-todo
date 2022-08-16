import { clone } from "../../lib/utils";
import { ITodo } from "../interfaces/ITodo";
import { MOCK_INITIAL_STATE, MOCK_TODOS } from "./testing/mocks";
import { changeFilterMode, editTodoUi, markAllCompletedUi } from "./todo.actions";
import { allAreCompleted, allCompletedTodos, allTodos, currentFilter, filteredTodos } from "./todo.selectors";
import { todosReducer } from './todos.reducer';


describe('Selectors', () => {
  const initialState = MOCK_INITIAL_STATE;
  let initialStateWithTodos = {...initialState, todos: MOCK_TODOS};

  beforeEach(() => {
    initialStateWithTodos = clone({...initialState, todos: MOCK_TODOS});
  });

  it('Should select all available Todos', () => {
    const result = allTodos.projector(initialStateWithTodos);
    expect(result.length).toBe(3);
  });

  it('Should select the correctly filtered Todos', () => {
    const updated: ITodo = clone(MOCK_TODOS[0]);
    updated.completed = true;

    const editAction = editTodoUi({ todo: updated});
    let state = todosReducer(initialStateWithTodos, editAction);

    let filterAction = changeFilterMode({ mode: 'Completed' });
    state = todosReducer(state, filterAction);

    let result = filteredTodos.projector(state);
    expect(result.length).toBe(1);

    filterAction = changeFilterMode({ mode: 'Active' });
    state = todosReducer(state, filterAction);
    result = filteredTodos.projector(state);
    expect(result.length).toBe(2);

    filterAction = changeFilterMode({ mode: 'All' });
    state = todosReducer(state, filterAction);
    result = filteredTodos.projector(state);
    expect(result.length).toBe(3);
  });

  it('Should return all completed Todos', () => {
    const updated: ITodo = clone(MOCK_TODOS[0]);
    updated.completed = true;

    const editAction = editTodoUi({ todo: updated});
    const state = todosReducer(initialStateWithTodos, editAction);

    const result = allCompletedTodos.projector(state);
    expect(result.length).toBe(1);
  });

  it('Should return true if all Todos are not completed', () => {
    const action = markAllCompletedUi();
    const state = todosReducer(initialStateWithTodos, action);

    const result = allAreCompleted.projector(state);
    expect(result).toBeTrue();
  });

  it('Should return false if all Todos are not completed', () => {
    const updated: ITodo = clone(MOCK_TODOS[0]);
    updated.completed = true;

    const editAction = editTodoUi({ todo: updated });
    const state = todosReducer(initialStateWithTodos, editAction);

    const result = allAreCompleted.projector(state);
    expect(result).toBeFalse();
  });

  it('Should return the correct filter', () => {
    const action = changeFilterMode({ mode: 'Completed' });
    const state = todosReducer(initialStateWithTodos, action);
    const result = currentFilter.projector(state);
    expect(result).toEqual('Completed');
  });
});
