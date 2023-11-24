const express = require('express');
const path = require('path');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const compression = require('compression');
require('dotenv').config();

const port = process.env.PORT || 3000; // set port
const publicDir = path.join(__dirname, 'public'); // set public directory
const viewsDir = path.join(__dirname, 'views'); // set views directory
const app = express(); // create express app

const appConf = require('./app.conf.json');
app.locals = appConf; // set app locals from app.conf.json file (e.g. app.locals.siteName)

app.set('view engine', 'pug'); // set view engine
app.set('views', `${viewsDir}/pages`); // set views directory

app.use(
  favicon(path.join(__dirname, 'public', 'site/assets/favicon/favicon.ico'))
); // serve favicon
app.use(express.static(publicDir)); // serve static files

app.use(morgan('dev')); // log requests to the console (dev)
app.use(compression()); // compress all requests

app.get('/', require('./controllers/home.controller')); // set home route
app.get('/about', require('./controllers/about.controller')); // set about route

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
