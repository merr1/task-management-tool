import { Injectable } from '@angular/core';
import { TaskModel, TaskStatus } from '../../models/task-model';
import { catchError, filter, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

const headerDict = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers':'Content-Type',
  'X-Skip-Interceptor': 'X-Skip-Interceptor'
};
const requestOptions ={
  headers: new HttpHeaders(headerDict),
};

const TASKS_API_URL = environment.api;

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  
  tableData: TaskModel[] = [];
  
  constructor(private http: HttpClient) { }

  getTableData(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(this.getEndpoint('GET'), requestOptions);
  }

  getTableDataById(id:string): Observable<TaskModel[]>{
    return this.http.get<TaskModel[]>(this.getEndpoint('GET_BY_ID', id));
  }
  
  search(searchKey:any): Observable<TaskModel[]>{
    if(searchKey == ""){
      return this.getTableData();
    }
    else
    {
      return this.http.get<TaskModel[]>(this.getEndpoint('GET')).pipe(
        map(tasks => tasks.filter(t =>{
          return (t.status === TaskStatus.New ? 'new' : t.status === TaskStatus.InProgress ? 'in progress' : 'completed').includes(searchKey.toLowerCase()) 
          || t.taskName.toLowerCase().includes(searchKey.toLowerCase()) 
          || t.taskDescription.toLowerCase().includes(searchKey.toLowerCase())
        }))
      );
    }
    
  }

  addTask(data:any):Observable<TaskModel[]>{
    return this.http.post<TaskModel[]>(this.getEndpoint('POST'), data, requestOptions);
  }

  editTask(data:any, id:string):Observable<TaskModel[]>{
    return this.http.put<TaskModel[]>(this.getEndpoint('PUT',id), data, requestOptions);
  }

  deleteTask(id:string):Observable<TaskModel[]>{
    return this.http.delete<TaskModel[]>(this.getEndpoint('DELETE',id), requestOptions);
  }

  private getEndpoint(keyword:string, param?:string): any{
    switch(keyword){
      case 'GET':
      case 'POST' : 
          return `${TASKS_API_URL}`;
      case 'GET_BY_ID':
      case 'PUT': 
      case 'DELETE' : 
          return `${TASKS_API_URL}/${param}`;
      default: 
          return "";
    }
  }
}
