import 'reflect-metadata';

import createConnection from '@shared/infra/typeorm';
import express from 'express';
import 'express-async-errors';

import errorHandler from '@shared/errors/errorHandler';
import routes from './routes';

import '@shared/container';

const app = express();

app.use(express.json());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
createConnection().then(conn => {
  app.use(routes);
  app.use(errorHandler);
});

export default app;
