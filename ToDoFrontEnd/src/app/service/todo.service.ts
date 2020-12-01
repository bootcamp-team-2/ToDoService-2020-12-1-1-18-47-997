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

  private _todoItems: Array<ToDoItem>;
  public failMessage: string;

  constructor(private todoStore: TodoStoreService, private todoHttpService: TodoHttpService) {
    this._todoItems = todoStore.GetAll();
    this.updatingToDoItem = new ToDoItem(-1, "", "", false);
    this.selectedTodoItem = new ToDoItem(-1, "", "", false);
    this.failMessage = '';
    // this.currentId = this.todoItems.length;
  }

  public get todoItems(): Array<ToDoItem> {
    const allTodoItem = new Array<ToDoItem>();
    this.todoHttpService.getAll().subscribe(
      todoItems => {
        allTodoItem.push(...todoItems);
        this.failMessage = '';
      },
      error => {
        this.failMessage = 'get all fail because of web api error';
      });
    return allTodoItem;
  }

  public SetUpdatingTodoItemId(id: number): void {
    this.todoHttpService.getById(id).subscribe(
      foundTodoItem => {
        if (foundTodoItem !== undefined) {
          this.updatingToDoItem = Object.assign({}, foundTodoItem);
        }
        this.failMessage = '';
      },
      error => {
        this.failMessage = 'fail to get item by id (set updated)';
        console.log(this.failMessage);
      }
    );
  }

  public Create(todoItem: ToDoItem): void {
    todoItem.id = this.currentId;
    var newTodoItem = Object.assign({}, todoItem);
    this.todoHttpService.create(newTodoItem).subscribe(
      todoItem => {
        console.log(todoItem);
        this.failMessage = '';
      },
      error => this.failMessage = 'create fail because of web api error',
    );

    this.currentId++;
  }

  public UpdateTodoItem(updateTodoItem: ToDoItem): void {
    this.todoHttpService.update(updateTodoItem).subscribe(
      todoItem => {
        console.log(todoItem);
        this.failMessage = '';
      },
      error => {
        this.failMessage = 'update fail because of web api error';
        console.log(this.failMessage);
      },
    );
  }

  public DeleteTodoItem(id: number):void{   
    this.todoStore.Delete(id); 
  }

  public SetSelectedTodoItemId(id: number):void{
    this.todoHttpService.getById(id).subscribe(
      todoItem => {
        this.selectedTodoItem = todoItem;
        this.failMessage = '';
      },
      error => {
        this.failMessage = 'fail to get item by id (set selected)';
        console.log(this.failMessage);
      },
    );
  }
}
