import { TodoitemDetailComponent } from './todoitem-detail/todoitem-detail.component';
import { ListTodoitemComponent } from './list-todoitem/list-todoitem.component';
import { CreateTodoitemComponent } from './create-todoitem/create-todoitem.component';
import { UpdateTodoItemComponent } from './update-todo-item/update-todo-item.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';
export const routes: Routes = [
  { path: "delete", component: ListTodoitemComponent },
  { path: "", component: ListTodoitemComponent },
  { path: "create", component: CreateTodoitemComponent },
  { path: "edit/:id", component: UpdateTodoItemComponent },
  { path: "detail/:id", component: TodoitemDetailComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
