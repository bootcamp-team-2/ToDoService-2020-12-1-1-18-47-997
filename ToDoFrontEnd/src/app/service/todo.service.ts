import { Injectable } from '@angular/core';
import { ToDoItem } from '../model/ToDoItem';
import { TodoHttpService } from './todo-http.service';
import { TodoStoreService } from './todo-store.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  public updatingToDoItem: ToDoItem;
  public selectedTodoItem: ToDoItem;
  private currentId: number = 0;
  public getAllFailMessage: string;

  private _todoItems: Array<ToDoItem>;

  // 替换todoStore
  constructor(private todoStore: TodoStoreService, private todoHttpService: TodoHttpService) {
    this._todoItems = todoStore.GetAll();
    this.updatingToDoItem = new ToDoItem(-1, "", "", false);
    this.selectedTodoItem = new ToDoItem(-1, "", "", false);
    this.getAllFailMessage = "";
    // this.currentId = this.todoItems.length;
  }

  public get todoItems(): Array<ToDoItem> {
    // return this.todoStore.GetAll();
    const allTodoItem = new Array<ToDoItem>();
    this.todoHttpService.GetAll().subscribe(todoItems => {
      allTodoItem.push(...todoItems);
    },
    error => {
      this.getAllFailMessage = "Get all because webapi error";
    });
    return allTodoItem;
  }

  public SetUpdatingTodoItemId(id: number): void {
    const foundTodoItem = this.todoStore.FindById(id);

    if (foundTodoItem !== undefined) {
      this.updatingToDoItem = Object.assign({}, foundTodoItem);
    }
  }

  public Create(todoItem: ToDoItem) {
    this.todoHttpService.Create(todoItem).subscribe( () => {this.getAllFailMessage = ""}, error => {
      this.getAllFailMessage = "post all because webapi error";
    });
  }

  public UpdateTodoItem(updateTodoItem: ToDoItem) {
    this.todoHttpService.Update(updateTodoItem).subscribe(
      () => this.getAllFailMessage = '' ,
      error => this.getAllFailMessage = 'update all because webapi error'
    );
  }

  public DeleteTodoItem(id: number) {
    this.todoHttpService.Delete(id).subscribe(() => this.getAllFailMessage = '' ,
      error => this.getAllFailMessage = 'get specific because webapi error'
    );
  }

  public SetSelectedTodoItemId(id: number) {
    this.todoHttpService.GetById(id).subscribe(() => this.getAllFailMessage = '' ,
      error => this.getAllFailMessage = 'get specific because webapi error'
    );

    // this.selectedTodoItem = this.todoStore.FindById(id);
  }
}
