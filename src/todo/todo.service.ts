import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoDocument } from './entities/todo.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name)
    private todoModel: Model<TodoDocument>,
  ) {}
  create(createTodoDto: CreateTodoDto) {
    return this.todoModel.create(createTodoDto);
  }

  findAll(id: string) {
    return this.todoModel.find({
      user: id,
    });
  }

  findOne(id: string) {
    return this.todoModel.findById(id);
  }

  update(id: string, updateTodoDto: UpdateTodoDto) {
    return this.todoModel.findOneAndUpdate(
      {
        _id: id,
      },
      updateTodoDto,
      {
        new: true,
      },
    );
  }

  remove(id: string) {
    return this.todoModel.findOneAndDelete({
      _id: id,
    });
  }
}
