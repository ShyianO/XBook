import { ITodo } from './todo.state';

export class AddTodo {
  static readonly type = '[Todo] Add';
  constructor(public payload: ITodo) {}
}

export class MarkDone {
  static readonly type = '[Todo] markDone';
  constructor(public payload: string, public isDone: boolean) {}
}

export class FetchAllTodos {
  static readonly type = '[Todo] Fetch All';
}
