import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { CompleteAllComponent } from './components/complete-all/complete-all.component';
import { TodosListComponent } from './components/todo-list/todo-list.component';
import { TodosService } from './services/todos.service';
import { todosReducer } from './state/todos.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TodosEffect } from './state/todo.effects';
import { TodoDb } from './services/db';
import { TodoComponent } from './components/todo/todo.component';
import { TodosComponent } from './pages/todos/todos.component';
import { Route, RouterModule } from '@angular/router';

const DECLARATIONS = [
  CompleteAllComponent,
  TodosListComponent,
  TodoComponent,
  TodosComponent
];

const TODO_ROUTES: Route[] = [
  {
    path: 'all',
    component: TodosComponent
  },
  {
    path: 'completed',
    component: TodosComponent
  },
  {
    path: 'active',
    component: TodosComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'all'
  }
]

@NgModule({
  declarations: [
    ...DECLARATIONS
  ],
  exports: [
    ...DECLARATIONS
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('todos', todosReducer),
    EffectsModule.forFeature([TodosEffect]),
    RouterModule.forChild(TODO_ROUTES)
  ],
  providers: [
    TodosService,
    TodoDb
  ],
})
export class TodosModule {}
