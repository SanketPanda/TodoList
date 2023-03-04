import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Task } from '../models/task.mode';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit, OnChanges {

  @Output() onTaskAdd = new EventEmitter<any>();
  @Output() onTaskUpdate = new EventEmitter<any>();
  @Output() onTaskCancel = new EventEmitter<any>();
  @Input() formValues! : Task;

  btnTitle: string = 'Submit';

  form: FormGroup = this.fb.group({
    id:[],
    title: [
      null,
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ],
    ],
    description: [
      null,
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(155),
      ],
    ],
  });

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id:[],
      title: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(155),
        ],
      ],
    });
  }

  ngOnChanges(){
     this.initialiZeForm(this.formValues);
  }

  public initialiZeForm(task: Task){
    if(!task || task.title == ''){
      this.btnTitle = 'Submit';
      return;
    }
     this.btnTitle = 'Update';
     this.form.patchValue({'id': task.id, 'title': task.title, 'description': task.description});
  }

  public addNewTask(form: any) {
    if(this.btnTitle == 'Update'){this.onUpdate(form); return;}
    this.onTaskAdd.emit(form.value as Task);
    this.form.reset();
  }

  public onUpdate(form: any){
     this.onTaskUpdate.emit(form.value as Task);
     this.form.reset();
     this.btnTitle = 'Submit';
  }

  public onCancel(){
    this.btnTitle = 'Submit';
    this.form.reset();
    this.onTaskCancel.emit();
  }
}
