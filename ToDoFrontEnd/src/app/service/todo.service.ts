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

  private _todoItems: Array<ToDoItem>;
  public getAllFailMessage: string;
  public createFailMessage: string;
  public updateFailMessage: string;
  public deleteFailMessage: string;
  public selectFailMessage: string;

  constructor(private todoStore: TodoStoreService, private todoHttpService: TodoHttpService) {
    this._todoItems = todoStore.GetAll();
    this.updatingToDoItem = new ToDoItem(-1, "", "", false);
    this.selectedTodoItem = new ToDoItem(-1, "", "", false);
    // this.currentId = this.todoItems.length;
    this.getAllFailMessage = '';
    this.createFailMessage = '';
    this.updateFailMessage = '';
    this.deleteFailMessage = '';
    this.selectFailMessage = '';
  }

  public get todoItems(): Array<ToDoItem> {
    const allTodoItem = new Array<ToDoItem>();
    this.todoHttpService.GetAll().subscribe(todoItems => { allTodoItem.push(...todoItems); },
      error => { this.getAllFailMessage = 'Get all fail because get api error'; });
    return allTodoItem;
  }

  public SetUpdatingTodoItemId(id: number): void {
    this.todoHttpService.GetById(id).subscribe(
      item => {
        this.updatingToDoItem = item;
        console.log(item); this.selectFailMessage = '';
      },
      error => { this.selectFailMessage = 'Select fail because select api error'; });
  }

  public Create(todoItem: ToDoItem): void {
    this.todoHttpService.Create(todoItem).subscribe(todoItem => { console.log(todoItem); this.createFailMessage = ''; },
      error => { this.createFailMessage = 'Create fail because create api error'; });
  }

  public UpdateTodoItem(updateTodoItem: ToDoItem): void {
    this.todoHttpService.Update(updateTodoItem).subscribe(
      updateItem => { console.log(updateItem); this.updateFailMessage = ''; },
      error => { this.updateFailMessage = 'Update fail because update api error'; });
  }

  public DeleteTodoItem(id: number): void {
    this.todoHttpService.Delete(id).subscribe(deleteId => { console.log(deleteId); this.deleteFailMessage = '';},
      error => { this.deleteFailMessage = 'Delete fail because delete api error'; });
  }

  public SetSelectedTodoItemId(id: number): void {
    this.todoHttpService.GetById(id).subscribe(
      item => {
        this.selectedTodoItem = item;
        console.log(item); this.selectFailMessage = '';
      },
      error => { this.selectFailMessage = 'Select fail because select api error'; });
  }
}
