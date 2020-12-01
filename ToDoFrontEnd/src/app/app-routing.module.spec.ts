import { Location } from "@angular/common";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { ListTodoitemComponent } from './list-todoitem/list-todoitem.component';
import { CreateTodoitemComponent } from './create-todoitem/create-todoitem.component';
import { TodoitemDetailComponent } from './todoitem-detail/todoitem-detail.component';
import { UpdateTodoItemComponent } from './update-todo-item/update-todo-item.component';
import {routes} from './app-routing.module';

describe("Router", () => {
  let location: Location;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [
        UpdateTodoItemComponent,
        TodoitemDetailComponent,
        CreateTodoitemComponent,
        ListTodoitemComponent,
      ]
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    router.initialNavigation();
  });

  it('test navigate "" redirect to /', fakeAsync(() =>{
    router.navigate(['']);
    tick(50);
    expect(location.path()).toBe('/');
  }));

  it('test navigate "edit/1" redirect to /edit/1', fakeAsync(() =>{
    router.navigate(['edit/1']);
    tick(50);
    expect(location.path()).toBe('/edit/1');
  }));

  it('test navigate "detail/1" redirect to /detail/1', fakeAsync(() =>{
    router.navigate(['detail/1']);
    tick(50);
    expect(location.path()).toBe('/detail/1');
  }));
});
