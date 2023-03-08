import express, { ErrorRequestHandler } from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';

import routes from 'routes';

const app = express();

app.use(cors());
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());

app.use('/', routes);

app.use((_, __, next) => {
  const err = new Error('Not Found');
  next({
    ...err,
    status: 404,
  });
});

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const message = req.app.get('env') === 'development' ? err : {};
  res.locals.error = err;

  if (!err.status) {
    res.status(500);
  } else {
    res.status(err.status);
  }
  // eslint-disable-next-line no-console
  console.trace(err.message, message, 'uncaught');
  res.send(err);
};

app.use(errorHandler);

export default app;
