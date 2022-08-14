import { ITodo } from "../../interfaces/ITodo";
import { ITodosState } from "../todos.reducer";

export const MOCK_INITIAL_STATE: ITodosState = {
  todos: [],
  filterMode: 'All',
  errors: null
};

export const MOCK_TODOS: ITodo[] = [
  {
    text: 'Baz',
    completed: false,
    id: 1,
    editing: false
  },
  {
    text: 'Bar',
    completed: false,
    id: 2,
    editing: false
  },
  {
    text: 'Foo',
    completed: false,
    id: 3,
    editing: false
  }
]

export const MOCK_TODOS_SORTED: ITodo[] = [
  {
    text: 'Foo',
    completed: false,
    id: 3,
    editing: false
  },
  {
    text: 'Bar',
    completed: false,
    id: 2,
    editing: false
  },
  {
    text: 'Baz',
    completed: false,
    id: 1,
    editing: false
  }
]
