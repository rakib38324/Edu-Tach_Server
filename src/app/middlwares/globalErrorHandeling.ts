/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import config from '../config/config';
import handleValidationError from '../errors/handleValidationError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/App.Error';
import handleCastError from '../errors/handleCastError';
import UnauthrizedError from '../errors/unauthorizedError';

const globalErrorHandel: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = 'Errors!!!';
  let errorMessage = 'Something went wrong!';

  let errorDetails = {} || null;

  if (error instanceof ZodError) {
    statusCode = 400;
    const ZodMessage = handleZodError(error);
    message = ZodMessage.message;
    errorMessage = ZodMessage.errorMessage;
    errorDetails = error;
  } else if (error?.name === 'ValidationError') {
    const validationError = handleValidationError(error);
    statusCode = 400;
    message = validationError?.message;
    errorMessage = validationError?.errorMessage;
    errorDetails = error;
  } else if (error.name === 'CastError') {
    const CastError = handleCastError(error);
    statusCode = 400;
    message = CastError?.message;
    errorMessage = CastError?.errorMessage;
    errorDetails = error;
  } else if (error.code === 11000) {
    const errorData = handleDuplicateError(error);
    statusCode = errorData?.statusCode;
    message = errorData?.message;
    errorMessage = errorData.errorSources;
    errorDetails = error;
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = 'Error';
    errorMessage = error?.message;
    errorDetails = error;
  } else if (error instanceof UnauthrizedError) {
    message = 'Unauthorized Access';
    errorMessage = error?.message;
    errorDetails = null;
  } else if (error instanceof Error) {
    message = error?.name;
    errorMessage = error?.message;
    errorDetails = error;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails,
    stack: config.NODE_ENV === 'development' ? error?.stack : null,
  });
};

export default globalErrorHandel;
