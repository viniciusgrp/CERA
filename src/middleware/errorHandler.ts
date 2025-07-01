import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

export class AppError extends Error {
  public statusCode: number;
  public status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleCastError = (err: any): AppError => {
  return new AppError(`ID inválido: ${err.value}`, 400);
};

const handleDuplicateFields = (err: any): AppError => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`${field} '${value}' já existe`, 400);
};

const handleValidationError = (err: MongooseError.ValidationError): AppError => {
  const errors = Object.values(err.errors).map(el => el.message);
  return new AppError(`Dados inválidos: ${errors.join('. ')}`, 400);
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (error.name === 'CastError') error = handleCastError(error);
  if (error.code === 11000) error = handleDuplicateFields(error);
  if (error.name === 'ValidationError') error = handleValidationError(error);

  res.status(error.statusCode).json({
    status: error.status,
    statusCode: error.statusCode,
    message: error.message
  });
};

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Rota ${req.originalUrl} não encontrada`, 404);
  next(err);
};