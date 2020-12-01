import { Router } from '@angular/router';
import { Component, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ToDoItem } from '../model/ToDoItem';
import { TodoService } from '../service/todo.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-list-todoitem',
  templateUrl: './list-todoitem.component.html',
  styleUrls: ['./list-todoitem.component.css']
})
export class ListTodoitemComponent implements OnInit {


  public toDoItems: ToDoItem[]

  constructor(public todoService: TodoService, private route: Router) {
    this.toDoItems = [];
  }

  ngOnInit(): void {
    this.toDoItems = this.todoService.todoItems;
  }

  public updateTodoItem(id: number): void {
    this.route.navigate(['edit', id]);
  }

  public deleteTodoItem(id: number): void {
    this.todoService.DeleteTodoItem(id);

    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate(['']);
  }

  public selectTodoItem(id: number): void {
    this.route.navigate(['detail', id]);
    this.todoService.SetSelectedTodoItemId(id);
  }

}
