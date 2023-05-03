export interface TaskModel{
    taskId?: string;
    taskName: string;
    taskDescription: string;
    dateCreated: Date;
    dateModified?: Date;
    dateFinished?: Date
    status?: TaskStatus
    tag: ITags[];
}

export interface ITags{
    tagId?: string;
    tagName: string;
    taskId?: string;
}

export enum TaskStatus{
    New = 0,
    InProgress = 1,
    Completed = 2
}