const express = require('express');
const path = require('path');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const compression = require('compression');
const mongoose = require('mongoose');
require('dotenv').config({
  path: path.join(__dirname, '.env.development')
});

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
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(compression()); // compress all requests

app.get('/', require('./controllers/home.controller')); // set home route
app.get('/about', require('./controllers/about.controller')); // set about route

app.get('/followers/:id', (req, res) => {
  res.json({
    id: req.params.id,
    followers: 1000
  });
});

// connect to MongoDB
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI);
  mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running.'
    );
    process.exit();
  });
  mongoose.connection.once('open', () => {
    console.log('MongoDB connected successfully!');
  });
} else {
  console.log(
    'MONGO_URI environment variable is not defined. Skipping MongoDB connection.'
  );
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
