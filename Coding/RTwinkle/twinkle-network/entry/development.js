'use strict';

require('@babel/register');
require('@babel/polyfill');
const express = require('express');
const path = require('path');
const app = express();

const server = require('../webpack/webpack.dev').default(app);
server.use(express.static(path.resolve(__dirname, '../public')));
const http = require('http');

http.createServer(server).listen(process.env.PORT, function() {
  console.log('Server listening on port:', process.env.PORT);
});
