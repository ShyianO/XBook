import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ITodo, TodoState } from '../../../store/todo.state';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddTodo, MarkDone } from '../../../store/todo.action';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  selected = 'option2';

  @Select(TodoState) todoList$: Observable<ITodo>;

  addForm = new FormGroup({
    title: new FormControl('', [Validators.required])
  });

  constructor(private store: Store) {}

  onSubmit(form: any): void {
    this.store.dispatch(new AddTodo(form));
  }

  markDone(id: string, isDone: boolean): void {
    this.store.dispatch(new MarkDone(id, isDone));
  }
}
