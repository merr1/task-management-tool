import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TaskConfirmationDialogComponent } from './task-confirmation-dialog/task-confirmation-dialog.component';
import { TasksService } from '../shared/services/task-manager/tasks.service';
import { TaskModel, TaskStatus } from '../shared/models/task-model';
import { ActivatedRoute, Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['taskName', 'taskDescription', 'taskDateCreated', 'taskDateModified','taskDateFinished','tags', 'taskStatus', 'actions'];
  dataSource = new MatTableDataSource<TaskModel>();
  assignedTasksCount: number;
  newTasksCount: number;
  newTasksCountPercentage : number;
  inProgressTasksCount: number;
  inProgressTasksCountPercentage: number;
  completedTasksCount: number;
  completedTasksCountPercentage: number;
  searchKey : string = '';
  @ViewChild(MatPaginator) paginator! : MatPaginator;

  constructor(private dialog: MatDialog,
              private _snackBar: MatSnackBar,
              private taskService: TasksService,
              private cd: ChangeDetectorRef,
              private _route: ActivatedRoute,
              private _router: Router
              ) { }

  ngOnInit(): void {
    this.populateTable();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openDialogConfirmation(id:string){
    this.taskService.getTableDataById(id).subscribe(res=>{
      const dialog = this.dialog.open(TaskConfirmationDialogComponent, {
        width:'300px',
        data: {action:'Delete', header:'Delete', content:'Are you sure to delete task?', confirmButton: 'Yes', cancelButton: 'No', task:res}
      }).afterClosed().subscribe((data:any) =>{
        if(data){
          this.taskService.deleteTask(data.taskId).subscribe(res => {
            this.populateTable();
            this.cd.detectChanges();
            this.openSnackBar("Task deleted successfully","Close")
          });
        }
      });
    });
  }

  populateTable(): void{
    this.taskService.getTableData().subscribe(data => {
      if(data){
        //For populating cards content
        this.dataSource.data = data;
        this.assignedTasksCount = data.length;
        this.newTasksCount = data.filter(t => t.status == TaskStatus.New).length;
        this.newTasksCountPercentage = this.getPercentageValue(this.assignedTasksCount, this.newTasksCount);
        this.inProgressTasksCount = data.filter(t => t.status == TaskStatus.InProgress).length;
        this.inProgressTasksCountPercentage = this.getPercentageValue(this.assignedTasksCount, this.inProgressTasksCount);
        this.completedTasksCount = data.filter(t => t.status == TaskStatus.Completed).length;
        this.completedTasksCountPercentage = this.getPercentageValue(this.assignedTasksCount, this.completedTasksCount);
        console.log(data.filter(t => t.status == TaskStatus.Completed).length);
      }
    });
  }

  getPercentageValue(totalTasks: number, initialTask: number){
    return (initialTask/totalTasks) * 100;
  }

  addTaskService(data: any){
    this.taskService.addTask(data).subscribe(data => {
      if(data){
        this.populateTable();
        this.cd.detectChanges();
      }
    });
  }

  editTaskService(data:any){
    this.taskService.editTask(data, data.taskId).subscribe(data => {
      if(data){
        this.populateTable();
        this.cd.detectChanges();
      }
    });
  }

  deleteTaskService(data:any){
    this.taskService.deleteTask(data['taskId']).subscribe(data => {
      if(data){
        this.populateTable();
        this.cd.detectChanges();
      }
    });
  }
  search(){
    this.searchKey= this.searchKey.trim();
    this.searchKey = this.searchKey.toLowerCase();
    this.taskService.search(this.searchKey).subscribe(data =>{
      if(data){
        this.dataSource.data = data;
        this.cd.detectChanges();
      }
    })
  }

  onAdd(){
    this._router.navigate(['/task']);
  }
  
  onEdit(id:string){
    this._router.navigate(['/task/'+id]);
  }

  openSnackBar(message: string, action: string) {
    const snackBarOpt: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    };

    this._snackBar.open(message, action, snackBarOpt);
  }
}
