import { Routes } from '@angular/router';
import { TodosPage } from './todos.page';
import { TodoDetailPage } from '../todo-detail/todo-detail.page';

/**
 * Routes for the Home module.
 */
export const routes: Routes = [
  {
    path: '',  // Default route for the Home module
    component: TodosPage,
  },
  {
    path: 'detail/:id',  // Route for displaying todo detail page with dynamic ID
    component: TodoDetailPage,
  }
];