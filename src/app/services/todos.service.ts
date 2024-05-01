import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../helper/api-endpoint';
import { Todo } from '../models/todos';
import { GenericResponse } from '../models/generic-response';

/**
 * Service for managing todo items.
 */
@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private httpClient: HttpClient) {}

  /**
   * Retrieves the list of todo items.
   * @returns Observable emitting an array of todo items.
   */
  getTodoList(): Observable<Todo[]>{
    const { url } = ApiEndpoint.TODOS.LIST
    return this.httpClient.get<Todo[]>(url);
  }

  /**
   * Creates a new todo item.
   * @param description Description of the todo item.
   * @param done Boolean indicating whether the todo item is completed.
   * @returns Observable emitting the created todo item.
   */
  createTodo(title: string, description: string, done: boolean): Observable<GenericResponse> {
    const { url } = ApiEndpoint.TODOS.CREATE
    const params = { title, description, done }
    return this.httpClient.post<GenericResponse>(url, params);
  }

  /**
   * Retrieves a specific todo item by its ID.
   * @param todoId ID of the todo item to retrieve.
   * @returns Observable emitting the requested todo item.
   */
  readTodos(todoId: string): Observable<Todo> {
    const { url } = ApiEndpoint.TODOS.READ
    return this.httpClient.get<Todo>(`${url}${todoId}`);
  }  

  /**
   * Updates an existing todo item.
   * @param todo Updated todo item object.
   * @returns Observable emitting the response after updating the todo item.
   */
  updateTodo(todo: Todo): Observable<GenericResponse> {
    const { url } = ApiEndpoint.TODOS.UPDATE
    return this.httpClient.put<GenericResponse>(`${url}${todo.todoId}`, todo);
  }

  /**
   * Deletes a todo item by its ID.
   * @param todoId ID of the todo item to delete.
   * @returns Observable emitting the response after deleting the todo item.
   */
  deleteTodo(todoId: string): Observable<any> {
    const { url } = ApiEndpoint.TODOS.DELETE
    return this.httpClient.delete<GenericResponse>(`${url}${todoId}`);
  }
}
