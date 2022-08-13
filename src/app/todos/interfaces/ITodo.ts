import { FormControl } from "@angular/forms";

export interface ITodo {
  id?: number;
  text: string;
  completed?: boolean;
}

export interface ITodoForm {
  id?: FormControl<number>;
  text: FormControl<string>;
  completed?: FormControl<boolean>;
}
