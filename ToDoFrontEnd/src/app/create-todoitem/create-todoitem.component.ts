import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToDoItem } from '../model/ToDoItem';
import { TodoService } from '../service/todo.service';

@Component({
  selector: 'app-create-todoitem',
  templateUrl: './create-todoitem.component.html',
  styleUrls: ['./create-todoitem.component.css']
})
export class CreateTodoitemComponent implements OnInit {

  constructor(private todoService: TodoService,
    private router: Router) {
    this.toDoItem = new ToDoItem(0, "1", "2", false);
  }

  public toDoItem: ToDoItem;

  ngOnInit(): void {
  }

  public createToDoItem(): void {
    this.todoService.Create(this.toDoItem);
    this.router.navigate(['']);
  }

  public get failMessage(): string {
    return this.todoService.failMessage;
  }

}
