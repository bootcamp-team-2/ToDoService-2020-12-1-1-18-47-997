import { TodoHttpService } from './todo-http.service';
import { Injectable } from '@angular/core';
import { ToDoItem } from '../model/ToDoItem';
import { TodoStoreService } from './todo-store.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  public updatingToDoItem: ToDoItem;
  public selectedTodoItem: ToDoItem;
  private currentId: number = 0;
  public getAllFailMessage: string;
  public postFailMessage: string;
  public detailFailMessage: string;
  public updateFailMessage: string;
  public deleteMessage: string;

  private _todoItems: Array<ToDoItem>;

  constructor(private todoStore: TodoStoreService, private todoHttpService: TodoHttpService) {
    this._todoItems = todoStore.GetAll();
    this.updatingToDoItem = new ToDoItem(-1, "", "", false);
    this.selectedTodoItem = new ToDoItem(-1, "", "", false);
    this.getAllFailMessage = '';
    this.postFailMessage = '';
    this.detailFailMessage = '';
    this.updateFailMessage = '';
    this.deleteMessage = '';
  }

  public get todoItems(): Array<ToDoItem> {
    const allTodoItem = new Array<ToDoItem>();
    this.todoHttpService.GetAll().subscribe(todoItems => {
      allTodoItem.push(...todoItems);
    },
    error => {
      this.getAllFailMessage = 'Get all fail because web API error';
    }
    );
    return allTodoItem;
  }

  public SetUpdatingTodoItemId(id: number): void {
    this.todoHttpService.GetById(id).subscribe(toDoItem => {
      this.updatingToDoItem = toDoItem;
    });

    // if (foundTodoItem !== undefined) {
    //   this.updatingToDoItem = Object.assign({}, foundTodoItem);
    // }
  }

  public Create(todoItem: ToDoItem) {
    this.todoHttpService.Create(todoItem).subscribe(todoItem => {console.log(todoItem); this.postFailMessage = ''; },
    error => {
      this.postFailMessage = 'Post fail because web API error';
    });
  }

  public UpdateTodoItem( updatingToDoItem: ToDoItem): void {
    this.todoHttpService.Put(updatingToDoItem).subscribe(todoItem => {
      console.log(todoItem); this.postFailMessage = ''; },
      error => {
        this.updateFailMessage = 'update fail because web API error';
      });
  }

  public DeleteTodoItem(id: number): void{
    this.todoHttpService.Delete(id).subscribe({next: todoItem =>
       { this.deleteMessage = 'delete successfully'}
  });
  }

  public SetSelectedTodoItemId(id: number): void{
    this.todoHttpService.GetById(id).subscribe(toDoItem => {
      this.selectedTodoItem = toDoItem;
    },
    error => {
      this.detailFailMessage = 'get detail fail because web API error';
    });
  }
}
