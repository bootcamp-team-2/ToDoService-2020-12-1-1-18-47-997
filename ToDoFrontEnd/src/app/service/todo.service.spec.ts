import { TodoHttpService } from './todo-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { defer, of } from 'rxjs';
import { ToDoItem } from '../model/ToDoItem';
import { TodoStoreService } from './todo-store.service';
import { TodoService } from './todo.service';

describe('TodoService', () => {

  let service: TodoService;
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy };
  let todoStoreService: TodoStoreService;
  let todoHttpService: TodoHttpService;

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);
    todoStoreService = new TodoStoreService();
    todoHttpService = new TodoHttpService(<any>(httpClientSpy));

    service = new TodoService(todoStoreService, todoHttpService);
    // TestBed.configureTestingModule({});
    // service = TestBed.inject(TodoService);
  });

  function asyncData<T>(data: T){
    return defer(() => Promise.resolve(data));
  }
  function asyncError<T>(errorObject: any){
    return defer(() => Promise.reject(errorObject));
  }
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all todoitems', () => {
    const expectAllTodoItems = todoStoreService.GetAll();
    httpClientSpy.get.and.returnValue(of(expectAllTodoItems));
    expect(service.todoItems.length).toBe(5);
    expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
  });

  it('should process error response when get all todoitems fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
    // when
    service.todoItems;
    tick(50);
    //then
    expect(service.getAllFailMessage).toBe("Get all because webapi error");
  }));

  it('should create todo-item via mockhttp', () => {
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.post.and.returnValue(of(newTodoItem));
    service.Create(newTodoItem);

    // then
    expect(httpClientSpy.post.calls.count()).toBe(1, "one call");
  });

  it('should process error response when create 5 todoitems fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.post.and.returnValue(asyncError(errorResponse));
    // when
    service.Create(newTodoItem);
    tick(50);
    //then
    expect(service.getAllFailMessage).toBe("post all because webapi error");
  }));

  it('should update todo-item via mock', () => {
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.put.and.returnValue(of(newTodoItem));
    service.UpdateTodoItem(newTodoItem);

    // then
    expect(httpClientSpy.put.calls.count()).toBe(1, "one call");
  });

  it('should process error response when update 5 todoitems fail', fakeAsync(() => {
    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.put.and.returnValue(asyncError(errorResponse));
    // when
    service.UpdateTodoItem(newTodoItem);
    tick(50);
    //then
    expect(service.getAllFailMessage).toBe("update all because webapi error");
  }));

  it('should delete todo item', () => {
    const id = service.todoItems[0].id;
    service.DeleteTodoItem(id);
    expect(service.todoItems.length).toBe(4);
  });

  it('should get special todo item via mock', () => {
    const foundTodoItem = todoStoreService.FindById(1);
    httpClientSpy.get.and.returnValue(of(foundTodoItem));
    service.SetSelectedTodoItemId(1);

    // then
    expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
  });
});
