import { CreateTodoitemComponent } from './../create-todoitem/create-todoitem.component';
import { TodoHttpService } from './todo-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { defer, of } from 'rxjs';
import { ToDoItem } from '../model/ToDoItem';
import { TodoStoreService } from './todo-store.service';
import { TodoService } from './todo.service';

const errorResponse = new HttpErrorResponse({
  error: 'test 404 error',
  status: 404, statusText: 'Not Found'
});
describe('TodoService', () => {

  let service: TodoService;
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy, delete: jasmine.Spy };
  let todoStoreService: TodoStoreService;
  let todoHttpService: TodoHttpService;

  beforeEach(() => {
    // TODO: spy on other methods too
    // httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    todoStoreService = new TodoStoreService();
    todoHttpService = new TodoHttpService(httpClientSpy as any);

    service = new TodoService(todoStoreService, todoHttpService);
    // TestBed.configureTestingModule({});
    // service = TestBed.inject(TodoService);

  });

  function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
  }
  function asyncError<T>(errorObject: any) {
    return defer(() => Promise.reject(errorObject));
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all todoitems', () => {
    // httpClientSpy.get.and.returnValue(asyncData<Array<ToDoItem>>(expectAllTodoItems));
    const expectAllTodoItems = todoStoreService.GetAll();
    httpClientSpy.get.and.returnValue(of(expectAllTodoItems));
    expect(service.todoItems.length).toBe(5);
    expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
  });

  it('should process error response when get all todoitems fail', fakeAsync(() => {
    // given
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
    // when
    service.todoItems;
    tick(50);
    // then
    expect(service.getAllFailMessage).toBe('Get all fail because get api error');
  }));

  it('should create todo-item via mockhttp', () => {
    // given
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.post.and.returnValue(of(newTodoItem));
    // when
    service.Create(newTodoItem);
    // then
    expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
  });

  it('should process error response when create fail', fakeAsync(() => {
    // given

    httpClientSpy.post.and.returnValue(asyncError(errorResponse));
    // when
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    service.Create(newTodoItem);
    tick(50);
    // then
    expect(service.createFailMessage).toBe('Create fail because create api error');
  }));

  it('should update todo-item', () => {
    // given
    const updateTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.put.and.returnValue(of(updateTodoItem));

    // when
    service.UpdateTodoItem(updateTodoItem);

    // then
    expect(httpClientSpy.put.calls.count()).toBe(1, 'one update call');

  });

  it('should process error response when update fail', fakeAsync(() => {
    // given
    const updateTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.put.and.returnValue(asyncError(errorResponse));

    // when
    service.UpdateTodoItem(updateTodoItem);
    tick(50);

    // then
    expect(service.updateFailMessage).toBe('Update fail because update api error');

  }));

  it('should delete todo item', () => {
    // given
    const updateTodoItem = new ToDoItem(10, "new todo", "new todo description", false);

    httpClientSpy.delete.and.returnValue(of(updateTodoItem));

    // when
    service.DeleteTodoItem(updateTodoItem.id);

    // then
    expect(httpClientSpy.delete.calls.count()).toBe(1, 'one delete call');
  });

  it('should process error response when delete fail', fakeAsync(() => {
    // given
    httpClientSpy.delete.and.returnValue(asyncError(errorResponse));

    // when
    service.DeleteTodoItem(6);
    tick(50);

    // then
    expect(service.deleteFailMessage).toBe('Delete fail because delete api error');

  }));

  it('should get special todo item', () => {
    // given

    const updateTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    const id = updateTodoItem.id;
    httpClientSpy.get.and.returnValue(of(updateTodoItem));

    // when
    service.SetSelectedTodoItemId(id);

    // then
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one get call');
  });

  it('should process error response when getbyid fail', fakeAsync(() => {
    // given
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    // when
    service.SetSelectedTodoItemId(6);
    tick(50);

    // then
    expect(service.selectFailMessage).toBe('Select fail because select api error');
  }));
});
