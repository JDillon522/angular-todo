import { FILTER_MODES } from '../constants/filter-modes';
import { ITodo } from './ITodo';

export interface ITodoActionId {
  id: number;
}

export interface ITodoActionCreate {
  text: string;
}

export interface ITodoActionUpdate extends ITodo {}

export interface ITodoActionFilter {
  mode: FILTER_MODES;
}

export interface ITodoActionSync {
  todos: ITodo[];
}
