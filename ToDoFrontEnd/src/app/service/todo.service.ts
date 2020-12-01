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
      },
      error => {
        this.failMessage = 'get all fail because of web api error';
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
    todoItem.id = this.currentId;
    var newTodoItem = Object.assign({}, todoItem);
    this.todoHttpService.create(newTodoItem).subscribe(
      todoItem => console.log(todoItem),
      error => this.failMessage = 'create fail because of web api error',
    );

    this.currentId++;
  }

  public UpdateTodoItem(updateTodoItems: ToDoItem): void {
    this.todoStore.Update(updateTodoItems);
  }

  public DeleteTodoItem(id: number):void{   
    this.todoStore.Delete(id); 
  }

  public SetSelectedTodoItemId(id: number):void{
    this.selectedTodoItem = this.todoStore.FindById(id);
  }
}
