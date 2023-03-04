import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Task } from '../to-do/models/task.mode';
import { ToDoDetailsComponent } from '../to-do/to-do-details.component';
import { ToDoComponent } from '../to-do/to-do-details/to-do.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

   newTask!: Task;
   formValues!: Task;
   updatedTask!: Task;

  constructor(
    ){}

  ngOnInit(): void {

  }

  public addTasks($event: any){
    this.newTask = $event as Task;
  }

  public editTask(task: any){
     this.formValues = task;
  }

  public updateTask($event: any){
     this.updatedTask = $event;
     this.formValues = new Task('','','');
  }

  public cancelTask($event: any){
    this.formValues = $event;
  }
}
