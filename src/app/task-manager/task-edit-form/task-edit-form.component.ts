import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { TasksService } from 'src/app/shared/services/task-manager/tasks.service';

@Component({
  selector: 'app-task-edit-form',
  templateUrl: './task-edit-form.component.html',
  styleUrls: ['./task-edit-form.component.scss']
})
export class TaskEditFormComponent implements OnInit {
  taskManagerFormGroup = this._formBuilder.group({
    taskId: [null],
    taskName : [null, Validators.required],
    taskDescription : [null, Validators.required],
    status : [0]
  });
  
  tagsFormGroup = this._formBuilder.group({
    tag : [[], Validators.required]
  });
  constructor(private _snackBar: MatSnackBar,
              private _route: ActivatedRoute,
              private _router: Router,
              private _formBuilder: FormBuilder,
              private taskService: TasksService
              ) { }

  ngOnInit(): void {
      let taskId = this._route.snapshot.paramMap.get('id');
      this.setValue(taskId);
  }
  
  setValue(id:string){
    this.taskService.getTableDataById(id).subscribe({next:(data) => {
      if(data){
        this.taskManagerFormGroup.controls['taskName'].setValue(data['taskName']);
        this.taskManagerFormGroup.controls['taskDescription'].setValue(data['taskDescription']);
        this.taskManagerFormGroup.controls['status'].setValue(data['status'].toString());
        this.taskManagerFormGroup.controls['taskId'].setValue(data['taskId']);
        this.tagsFormGroup.controls['tag'].setValue(data['tag']);
      }
    }});
  }
  
  save(){
    let task = this.taskManagerFormGroup.value;
    let tagFormGroup = this.tagsFormGroup.controls['tag'].value as [];

    task.tag = tagFormGroup.map(tag => ({ tagName: tag['tagName'] }));
    let status = task.status;
    (status === "0" ? task.status = 0 : status === "1" ? task.status = 1 : task.status = 2);

    this.taskService.editTask(task, task.taskId).subscribe({next: (data) => {
      if(data){
        this._router.navigate(['/']).then(() => {
          this.openSnackBar("Task updated successfully", "Close");
        });
      }
    }});
    
  }

  onBack(){
    this._router.navigate(['/']);
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
