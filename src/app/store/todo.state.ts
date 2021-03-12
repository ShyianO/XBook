import { Injectable } from '@angular/core';
import { State, NgxsOnInit, Action, StateContext } from '@ngxs/store';
import { AddTodo, MarkDone, FetchAllTodos } from './todo.action';
import { patch, updateItem } from '@ngxs/store/operators';

export interface ITodo {
  id: string;
  title: string;
  isDone: boolean;
}

export interface ITodoStateModel {
  todoList: ITodo[];
}

@State<ITodoStateModel>({
  name: 'todoList',
  defaults: {
    todoList: []
  }
})
@Injectable()
export class TodoState implements NgxsOnInit {
  ngxsOnInit(ctx: StateContext<ITodoStateModel>): void {
    ctx.dispatch(new FetchAllTodos());
  }

  @Action(MarkDone)
  markDone(
    ctx: StateContext<ITodoStateModel>,
    { payload, isDone }: MarkDone
  ): void {
    ctx.setState(
      patch({
        todoList: updateItem(
          (item: ITodo) => item.id === payload,
          patch({ isDone: !isDone })
        )
      })
    );
  }

  @Action(AddTodo)
  add(ctx: StateContext<ITodoStateModel>, { payload }: AddTodo): void {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      todoList: [
        ...state.todoList,
        {
          ...payload,
          id: Math.random().toString(36).substring(7),
          isDone: false
        }
      ]
    });
  }
}
