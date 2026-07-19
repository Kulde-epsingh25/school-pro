import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: any[];

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  
  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`);
    console.error(err);
  }

  // Handle specific known errors (e.g., JWT errors, Zod errors)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: {
        message: "Validation Error",
        code: "VALIDATION_ERROR",
        details: err.errors
      }
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: "APP_ERROR",
        details: err.errors
      }
    });
  }

  // Generic fallback for unhandled errors
  return res.status(err.statusCode).json({
    success: false,
    error: {
      message: "An unexpected error occurred. Please try again later.",
      code: "INTERNAL_SERVER_ERROR"
    }
  });
};
