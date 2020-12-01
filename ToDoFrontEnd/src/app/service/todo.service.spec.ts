import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { defer, of } from 'rxjs';
import { ToDoItem } from '../model/ToDoItem';
import { TodoHttpService } from './todo-http.service';
import { TodoStoreService } from './todo-store.service';
import { TodoService } from './todo.service';

describe('TodoService', () => {

  let service: TodoService;
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy, delete: jasmine.Spy };
  let todoStoreService: TodoStoreService;
  let todoHttpService: TodoHttpService;

  function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
  }
    function asyncError<T>(errorObject: any) {
      return defer(() => Promise.reject(errorObject));
    }

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    todoStoreService = new TodoStoreService();
    todoHttpService = new TodoHttpService(httpClientSpy as any);
    service = new TodoService(todoStoreService, todoHttpService);

    // TestBed.configureTestingModule({});
    // service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all todoitems', () => {
    const expectAllItems = todoStoreService.GetAll();
    httpClientSpy.get.and.returnValue(of(expectAllItems));

    expect(service.todoItems.length).toBe(5);
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should process error response when get all todoitems fail', fakeAsync(() => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    service.todoItems;
    tick(50);

    expect(service.failMessage).toBe('get all fail because of web api error');
  }));

  it('should create todo-item via mockhttp', () => {
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.post.and.returnValue(of(newTodoItem));
    service.Create(newTodoItem);
    
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

  it('should process error response when create new todoitem fail', fakeAsync(() => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });

    httpClientSpy.post.and.returnValue(asyncError(errorResponse));
    const newItem = new ToDoItem(1, '', '', true);
    service.Create(newItem);
    tick(50);

    expect(service.failMessage).toBe('create fail because of web api error');
  }));

  it('should update todo-item', () => {
    const expectAllItems = todoStoreService.GetAll();
    httpClientSpy.get.and.returnValue(of(expectAllItems));
    let updateTodoItem = service.todoItems[0];
    updateTodoItem.description = "updated description";
    updateTodoItem.title = "updated title";
    updateTodoItem.isDone = true;
    httpClientSpy.put.and.returnValue(of(updateTodoItem));

    service.UpdateTodoItem(updateTodoItem);

    expect(service.todoItems.length).toBe(5);
    expect(service.todoItems[0].description).toBe(updateTodoItem.description);
    expect(service.todoItems[0].title).toBe(updateTodoItem.title);
    expect(service.todoItems[0].isDone).toBe(updateTodoItem.isDone);
  });

  it('should delete todo item', () => {
    const id = service.todoItems[0].id;
    service.DeleteTodoItem(id);
    expect(service.todoItems.length).toBe(4);
  });

  it('should get special todo item', () => {
    const id = service.todoItems[4].id;
    service.SetSelectedTodoItemId(id);
    expect(service.selectedTodoItem.id).toBe(id);
  });
});
