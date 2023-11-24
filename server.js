const express = require('express');
const path = require('path');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const compression = require('compression');
require('dotenv').config();

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const viewsDir = path.join(__dirname, 'views');
const app = express();

// set app locals from app.conf.json
const appConf = require('./app.conf.json');
app.locals = appConf;

app.set('view engine', 'pug');
app.set('views', `${viewsDir}/pages`);

app.use(
  favicon(path.join(__dirname, 'public', 'site/assets/favicon/favicon.ico'))
);
app.use(express.static(publicDir));

app.use(morgan('dev'));
app.use(compression());

app.get('/', require('./controllers/home.controller'));
app.get('/about', require('./controllers/about.controller'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
