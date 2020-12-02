import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToDoItem } from '../model/ToDoItem';
import { TodoService } from '../service/todo.service';

@Component({
  selector: 'app-list-todoitem',
  templateUrl: './list-todoitem.component.html',
  styleUrls: ['./list-todoitem.component.css']
})
export class ListTodoitemComponent implements OnInit {


  public toDoItems: ToDoItem[]

  constructor(public todoService: TodoService, private router: Router) {
    this.toDoItems = [];
  }

  ngOnInit(): void {
    this.toDoItems = this.todoService.todoItems;
  }

  public updateTodoItem(id: number): void {
    this.router.navigate(['edit', id]);
    // this.todoService.SetUpdatingTodoItemId(id);
  }

  public deleteTodoItem(id: number): void {
    this.router.navigate(['']);
    // this.todoService.DeleteTodoItem(id);
  }

  public selectTodoItem(id: number): void {
    this.router.navigate(['detail', id]);
    // this.todoService.SetSelectedTodoItemId(id);
  }
}
