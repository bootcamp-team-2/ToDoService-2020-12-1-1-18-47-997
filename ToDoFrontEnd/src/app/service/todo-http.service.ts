import { ToDoItem } from './../model/ToDoItem';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TodoHttpService {

  constructor(private httpClient: HttpClient) {

  }

  public GetAll(): Observable<Array<ToDoItem>> {
    return this.httpClient.get<Array<ToDoItem>>("https://localhost:5001/ToDoItem");
  }

  public Create(toDoItem: ToDoItem): Observable<ToDoItem> {
    return this.httpClient.post<ToDoItem>("https://localhost:5001/ToDoItem", toDoItem, httpOptions);
  }
}
