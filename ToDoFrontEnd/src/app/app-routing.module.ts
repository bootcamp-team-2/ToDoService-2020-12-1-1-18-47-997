import { ListTodoitemComponent } from './list-todoitem/list-todoitem.component';
import { TodoitemDetailComponent } from './todoitem-detail/todoitem-detail.component';
import { CreateTodoitemComponent } from './create-todoitem/create-todoitem.component';
import { UpdateTodoItemComponent } from './update-todo-item/update-todo-item.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: "", component: ListTodoitemComponent},
  {path: "detail", component: TodoitemDetailComponent},
  {path: "create", component: CreateTodoitemComponent},
  {path: "edit/:id", component: UpdateTodoItemComponent}
];
// 进行页面的切换
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
