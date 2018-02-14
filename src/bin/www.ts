import * as debug from 'debug';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import spdy = require('spdy');

import App from '../app';

debug('ts-express:server');

const normalizePort = (val: number|string): number|string|boolean => {
  // tslint:disable-next-line:no-shadowed-variable
  const port = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else {
    return false;
  }
};


const port = normalizePort(process.env.PORT || 3000);
App.set('port', port);

const options = {
  cert:  fs.readFileSync(__dirname + '/ssl/cert.pem'),
  key: fs.readFileSync(__dirname + '/ssl/key.pem'),
};

spdy.createServer(options, App)
    .listen(port, (error) => {
      if (error) {
        console.error(error);
        process.exit(1);
      }
    });
