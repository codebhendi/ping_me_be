/* eslint-disable no-console */
import 'module-alias/register';
import http from 'http';
import debug from 'debug';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';

dotenv.config();

import app from 'app';

const debugServer = debug('server:server');

const normalizePort = (val: string) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.USER_PORT || '5001');

const onError = (error: NodeJS.ErrnoException) => {
  console.log(error, 'server.ts');
  switch (error.code) {
    case 'EACCES':
      process.exit(1);
    case 'EADDRINUSE':
      process.exit(1);
    default:
      console.log(error);
      throw error;
  }
};

createConnection().then(() => {
  console.log('starting', process.env.USER_PORT);

  app.set('port', port);
  console.log('port', port);

  console.log('creating server');
  const server = http.createServer(app);
  server.setTimeout(1000 * 60 * 5);
  console.log('started server');

  console.log('listening on port');

  const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `Pipe ${port}` : `Port ${port}`;
    debugServer(`Listening on ${bind}`);
  };

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
});
