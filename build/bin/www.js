"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const fs = require("fs");
const spdy = require("spdy");
const app_1 = require("../app");
debug('ts-express:server');
const normalizePort = (val) => {
    // tslint:disable-next-line:no-shadowed-variable
    const port = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    }
    else if (port >= 0) {
        return port;
    }
    else {
        return false;
    }
};
const port = normalizePort(process.env.PORT || 3000);
app_1.default.set('port', port);
const options = {
    cert: fs.readFileSync(__dirname + '/ssl/cert.pem'),
    key: fs.readFileSync(__dirname + '/ssl/key.pem'),
};
spdy.createServer(options, app_1.default)
    .listen(port, (error) => {
    if (error) {
        console.error(error);
        process.exit(1);
    }
});
