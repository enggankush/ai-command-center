import { NextFunction, Request, Response } from "express";
import Todo from "../models/aiTodo";
import resHandler from "../middlewares/res-hadler";
import mongoose from "mongoose";

// GET all todos
export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await Todo.find().sort({ createdAt: -1 });

    resHandler.success(res, { data });
  } catch (error: any) {
    next(error);
  }
};

// CREATE todo
export const createTodos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { text } = req.body;

    if (!text) {
      return resHandler.error(res, {
        msg: "Todo text is required",
        code: 400,
      });
    }

    const data = await Todo.create({ text });
    resHandler.success(res, {
      data,
      code: 201,
      msg: "Todo created successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

// UPDATE todo
export const updateTodos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return resHandler.error(res, {
        msg: "Invalid Todo ID",
        code: 400,
      });
    }

    if (!text) {
      return resHandler.error(res, {
        msg: "Todo text is required",
        code: 400,
      });
    }

    const updatedData = await Todo.findByIdAndUpdate(
      id,
      { text },
      { returnDocument: "after" },
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

// DELETE todo
export const deleteTodos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return resHandler.error(res, {
        msg: "Invalid Todo ID",
        code: 400,
      });
    }

    const deletedData = await Todo.findByIdAndDelete(id);

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
