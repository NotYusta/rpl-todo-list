export interface ICancelledTask {
    name: string;
    target: string;
    cancelled_at: string;
}

export interface ICompletedTask {
    name: string;
    target: string;
    completed_at: string;    
}

export interface IOnGoingTask {
    name: string;
    target: string;
}

export interface ITaskData {
    cancelled: ICancelledTask[]
    completed: ICompletedTask[]
    on_going: IOnGoingTask[]
}

export interface IUserTaskList {
    [user: string]: ITaskData[];
}