import { Observable, of } from "rxjs";
import { tasks } from "src/app/task-manager/tasks";
import { TaskModel } from "../models/task-model";

export class MockTasksService{
    public tableData: TaskModel[] = JSON.parse(JSON.stringify(tasks));

    constructor(){}
    
    getTableData() {
        return of(this.tableData);
    }

    addTask(data : any){
        this.tableData.push(data);
        return of(this.tableData);
    }

    editTask(data : any, id: any){
        let taskIndex = this.tableData.findIndex(t => t.taskId === id);
        this.tableData[taskIndex].taskName = data.taskName;
        this.tableData[taskIndex].taskDescription = data.taskDescription;
        this.tableData[taskIndex].status = data.status;
        this.tableData[taskIndex].tag = data.tag;
        this.tableData[taskIndex].dateModified = data.dateModified;
        this.tableData[taskIndex].dateFinished = data.dateFinished;
        return of(this.tableData[taskIndex]);
    }

    deleteTask(id : any){
        this.tableData = this.tableData.filter(t => t.taskId != id);
        return of(this.tableData);
    }

    search(searchKey:string){
        this.tableData = this.tableData.filter(t => t.taskName.toLowerCase().includes(searchKey.toLowerCase()) || 
        t.taskDescription.toLowerCase().includes(searchKey.toLowerCase()));
        return of(this.tableData);
    }
}