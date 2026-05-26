import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export function createServer() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api', apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
