import { FILTER_MODES } from '../constants/filter-modes';
import { ITodo } from './ITodo';

export interface ITodoActionIndex {
  index: number;
}

export interface ITodoActionCreate {
  text: string;
}

export interface ITodoActionUpdate {
  index: number;
  text: string;
}

export interface ITodoActionFilter {
  mode: FILTER_MODES;
}

export interface ITodoActionSync {
  todos: ITodo[];
}
