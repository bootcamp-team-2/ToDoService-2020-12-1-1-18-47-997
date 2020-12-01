import { TodoHttpService } from './todo-http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { defer, of } from 'rxjs';
import { ToDoItem } from '../model/ToDoItem';
import { TodoStoreService } from './todo-store.service';
import { TodoService } from './todo.service';
// import{ TodoHttpService } from './todo-http.service';

describe('TodoService', () => {

  let service: TodoService;
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy, delete: jasmine.Spy };
  let todoStoreService: TodoStoreService;
  let todoHttpService: TodoHttpService;


  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    todoStoreService = new TodoStoreService();
    todoHttpService = new TodoHttpService(<any>httpClientSpy);

    service = new TodoService(todoStoreService, todoHttpService);
  });

  function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
  }

  function asyncError(errorObject: any) {
      return defer(() => Promise.reject(errorObject));
    }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all todoitems', () => {
    const expectAllTodoItems = todoStoreService.GetAll();
    httpClientSpy.get.and.returnValue(of(expectAllTodoItems));
    expect(service.todoItems.length).toBe(5);
    expect(httpClientSpy.get.calls.count()).toBe(1,"one call");
  });

  it('should process error response when get all todoItems fail', fakeAsync( () => {

    //given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
    //when
    service.todoItems;
    tick(50);
    //then
    expect(service.getAllFailMessage).toBe('Get all fail because web API error');
  }));



  it('should create todo-item via mockhttp', () => {
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.post.and.returnValue(of(newTodoItem));

    service.Create(newTodoItem);
    //then
    expect(httpClientSpy.post.calls.count()).toBe(1,"one call");
  });

  it('should process error response when create todoItems fail', fakeAsync( () => {

    //given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    const newTodoItem = new ToDoItem(10, "new todo", "new todo description", false);
    httpClientSpy.post.and.returnValue(asyncError(errorResponse));
    //when
    service.Create(newTodoItem);
    tick(50);
    //then
    expect(service.postFailMessage).toBe('Post fail because web API error');
  }));



  it('should update todo-item', fakeAsync(() => {
    // given
    const orignalTodoItem = todoStoreService.GetAll()[0];
    const updateTodoItem = todoStoreService.GetAll()[0];
    updateTodoItem.description = "updated description";
    updateTodoItem.title = "updated title";
    updateTodoItem.isDone = true;

    httpClientSpy.put.and.returnValue(of(updateTodoItem));
    // when
    service.UpdateTodoItem(updateTodoItem);
    tick(50);
    // then
    expect(httpClientSpy.put.calls.count()).toBe(1,"one call");
    expect(orignalTodoItem.description).toBe(updateTodoItem.description);
    expect(orignalTodoItem.title).toBe(updateTodoItem.title);
    expect(orignalTodoItem.isDone).toBe(updateTodoItem.isDone);
  }));

  it('should delete todo item', () => {
    const id = service.todoItems[0].id;
    service.DeleteTodoItem(id);
    expect(service.todoItems.length).toBe(4);
  });

  it('should get special todo item', fakeAsync(() => {
    // given
    const id = todoStoreService.GetAll()[0].id;
    const expectItem = todoStoreService.FindById(id)
    httpClientSpy.get.and.returnValue(of(expectItem));
    // when
    service.SetSelectedTodoItemId(id);
    tick(50);
    // then
    expect(service.selectedTodoItem.id).toBe(id);
    expect(httpClientSpy.get.calls.count()).toBe(1,"one call");
  }));

  it('should process error response when update todoItem fail', fakeAsync( () => {

    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    const updateTodoItem = todoStoreService.GetAll()[0];
    updateTodoItem.description = "updated description";
    updateTodoItem.title = "updated title";
    updateTodoItem.isDone = true;
    httpClientSpy.put.and.returnValue(asyncError(errorResponse));
    // when
    service.UpdateTodoItem(updateTodoItem);
    tick(50);
    // then
    expect(service.updateFailMessage).toBe('update fail because web API error');
  }));


  it('should process error response when get todoItems detail fail', fakeAsync( () => {

    // given
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    const id = todoStoreService.GetAll()[0].id;
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
    // when
    service.SetSelectedTodoItemId(id);
    tick(50);
    // then
    expect(service.detailFailMessage).toBe('get detail fail because web API error');
  }));
});
