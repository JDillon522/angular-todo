import { FILTER_MODES } from '../constants/filter-modes';
import { ITodo } from './ITodo';

export interface ITodoActionToggleLoading {
  loading: boolean;
}

export interface ITodoActionId {
  id: number;
}

export interface ITodoActionCreate {
  text: string;
}

export interface ITodoActionUpdate {
  todo: ITodo;
}

export interface ITodoActionFilter {
  mode: FILTER_MODES;
}

export interface ITodoActionSync {
  todos: ITodo[];
}

export interface ITodoActionEditTodo {
  id: number;
  edit: boolean;
}

export interface ITodoActionError {
  err: string | Error;
}
