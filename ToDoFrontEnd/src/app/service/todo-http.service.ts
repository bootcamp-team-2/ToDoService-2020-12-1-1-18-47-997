import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf } from 'rxjs';
import { ToDoItem } from '../model/ToDoItem';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
@Injectable({
  providedIn: 'root'
})
export class TodoHttpService {
 

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<Array<ToDoItem>> {
    return this.httpClient.get<Array<ToDoItem>>('https://localhost:5001/ToDoItem');
  }

  public create(newTodoItem: ToDoItem): Observable<ToDoItem> {
    return this.httpClient.post<ToDoItem>('https://localhost:5001/ToDoItem', newTodoItem, httpOptions);
  }

  public update(updateTodoItem: ToDoItem): Observable<ToDoItem> {
    return this.httpClient.put<ToDoItem>('https://localhost:5001/ToDoItem', updateTodoItem, httpOptions);
  }

  public getById(id: number): Observable<ToDoItem> {
    return this.httpClient.get<ToDoItem>(`https://localhost:5001/ToDoItem/${id}`, httpOptions);
  }

  public delete(id: number): Observable<ToDoItem> {
    return this.httpClient.delete<ToDoItem>(`https://localhost:5001/ToDoItem?id=${id}`, httpOptions);
  }
}
