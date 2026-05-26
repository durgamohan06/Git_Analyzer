import type { ErrorRequestHandler, RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json({ message: 'Route not found' });
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const statusCode = response.statusCode >= 400 ? response.statusCode : 500;

  response.status(statusCode).json({
    message: error instanceof Error ? error.message : 'Internal server error'
  });
};
