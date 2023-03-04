import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4 as uuid } from 'uuid';
import { Column } from './models/column.model';
import { TodoBoard } from './models/todo.model';
import { Task } from './models/task.mode';
import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { PopUpComponent } from '../pop-up/pop-up.component';
import IdUtils from 'src/app/utils/id.util';

@Component({
  selector: 'app-to-do-details',
  templateUrl: './to-do-details.component.html',
  styleUrls: ['./to-do-details.component.css'],
})
export class ToDoDetailsComponent implements OnChanges {
  @Input() newTask!: Task;
  @Input() updatedTask!: Task;
  @Output() onTaskEdit = new EventEmitter<Task>();
  @Output() showModal = new EventEmitter<any>();

  constructor(public snackBar: MatSnackBar, public dialog: Dialog) {}

  ngOnInit() {
    this.getTaskList();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateTask(this.updatedTask);
    this.addTask(this.newTask);
    this.getTaskList();
  }

  public toDoBoard: TodoBoard = new TodoBoard('Todo Board', [
    new Column('IDEAS', [
      new Task('1', 'ToDO App', 'Create a to do app using Angular'),
      new Task('2', 'Hosting Angular App', 'Host the todo app in amazon aws'),
    ]),
    new Column('RESEARCH', []),
    new Column('TODO', []),
    new Column('DONE', []),
  ]);

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (event.container.id === 'cdk-drop-list-3') {
        this.autoDeleteTask();
      }
    }
    localStorage.setItem(
      'toDoBoardData',
      JSON.stringify(this.toDoBoard.columns)
    );
  }

  autoDeleteTask() {
    this.openSnackBar();
    setTimeout(() => {
      this.toDoBoard.columns[3].task = [];
    }, 10000);
  }

  openSnackBar() {
    this.snackBar.open(
      'Items in DONE state will be deleted in 10 Seconds.',
      'OK',
      {
        duration: 2000,
      }
    );
  }

  getTaskList() {
    let taskList = localStorage.getItem('toDoBoardData');
    if (!taskList) return;
    this.toDoBoard.columns = JSON.parse(taskList);
  }

  addTask(task: Task) {
    if (!task) return;
    task.id = IdUtils.getUUID();
    this.toDoBoard.columns[0].task.push(task);
    localStorage.setItem(
      'toDoBoardData',
      JSON.stringify(this.toDoBoard.columns)
    );
  }

  updateTask(updatedTask: Task) {
    if (!updatedTask) return;
    this.toDoBoard.columns.forEach((col) => {
      col.task.forEach((task) => {
        if (task.id == updatedTask.id) {
          task.title = updatedTask.title;
          task.description = updatedTask.description;
          return;
        }
      });
    });
    localStorage.setItem(
      'toDoBoardData',
      JSON.stringify(this.toDoBoard.columns)
    );
  }

  editTask(task: Task) {
    this.onTaskEdit.emit(task);
  }

  deleteTask(item: any) {
    console.log('deleteTask');
    const dialogRef = this.dialog.open<string>(PopUpComponent, {
      width: '300px',
      data: { title: 'Are you sure you want to delete?', data: item },
    });

    dialogRef.closed.subscribe((result) => {
      if (!result) return;
      this.toDoBoard.columns.forEach((col) => {
        col.task = col.task.filter((tsk) => {
          return tsk.id !== item.id;
        });
      });
      localStorage.setItem(
        'toDoBoardData',
        JSON.stringify(this.toDoBoard.columns)
      );
    });
  }
}
