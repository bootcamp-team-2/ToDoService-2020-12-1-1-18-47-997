import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTodoitemComponent } from './create-todoitem/create-todoitem.component';
import { ListTodoitemComponent } from './list-todoitem/list-todoitem.component';
import { TodoitemDetailComponent } from './todoitem-detail/todoitem-detail.component';
import { UpdateTodoItemComponent } from './update-todo-item/update-todo-item.component';

export const routes: Routes = [
  { path: '', component: ListTodoitemComponent },
  { path: 'create', component: CreateTodoitemComponent },
  { path: 'detail/:id', component: TodoitemDetailComponent },
  { path: 'edit/:id', component: UpdateTodoItemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
