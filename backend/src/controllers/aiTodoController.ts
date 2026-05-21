import { NextFunction, Request, Response } from "express";
import Todo from "../models/aiTodo";
import resHandler from "../middlewares/res-hadler";
import mongoose from "mongoose";
import * as todoService from "../services/todo/todoService";

export const getTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;
    const data = await Todo.find({ userId }).sort({ createdAt: -1 });

    resHandler.success(res, { data });
  } catch (error: any) {
    next(error);
  }
};

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;
    const { text } = req.body;

    if (!text) {
      return resHandler.error(res, {
        msg: "Todo text is required",
        code: 400,
      });
    }

    const todos = await todoService.createTodo(userId, text);
    resHandler.success(res, {
      data: todos,
      code: 201,
      msg: "Todo created successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const parseTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { text } = req.body;

    if (!text) {
      return resHandler.error(res, {
        msg: "Todo text is required for AI parsing",
        code: 400,
      });
    }

    const parsedTodos = await todoService.parseTodos(text);

    resHandler.success(res, {
      data: parsedTodos,
      msg: "Parsed todos generated successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const createBulkTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;
    const { todos } = req.body;

    if (!Array.isArray(todos) || todos.length === 0) {
      return resHandler.error(res, {
        msg: "A non-empty todo array is required",
        code: 400,
      });
    }

    const createdTodos = await todoService.createTodos(userId, todos);

    resHandler.success(res, {
      data: createdTodos,
      code: 201,
      msg: "Todos created successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const userId = res.locals.userId;
    const { text, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return resHandler.error(res, {
        msg: "Invalid Todo ID",
        code: 400,
      });
    }

    const updateData: any = {};
    if (text !== undefined) {
      updateData.text = text;
    }
    if (completed !== undefined) {
      updateData.completed = completed;
    }

    if (Object.keys(updateData).length === 0) {
      return resHandler.error(res, {
        msg: "No fields to update",
        code: 400,
      });
    }

    const updatedData = await Todo.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      {
        returnDocument: "after",
      },
    );

    if (!updatedData) {
      return resHandler.error(res, {
        msg: "No record found",
        code: 404,
      });
    }
    resHandler.success(res, {
      data: updatedData,
      msg: "Todo updated successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const userId = res.locals.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return resHandler.error(res, {
        msg: "Invalid Todo ID",
        code: 400,
      });
    }

    const deletedData = await Todo.findOneAndDelete({ _id: id, userId });

    if (!deletedData) {
      return resHandler.error(res, {
        msg: "No record found",
        code: 404,
      });
    }
    resHandler.success(res, {
      data: deletedData,
      msg: "Todo deleted successfully",
    });
  } catch (error: any) {
    next(error);
  }
};
