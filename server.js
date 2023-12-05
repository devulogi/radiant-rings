const express = require('express');
const path = require('path');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const compression = require('compression');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const passport = require('passport');
require('dotenv').config({
  path: path.join(__dirname, '.env.development')
});

const app = express(); // create express app
const port = process.env.PORT || 3000; // set port
const publicDir = path.join(__dirname, 'public'); // set public directory
const viewsDir = path.join(__dirname, 'views', 'pages'); // set views directory
const appConf = require('./app.conf.json'); // load app configuration
const cookieExpirationDate = 60 * 60 * 1000; // set express-session cookie expiration date
const faviconPath = path.join(
  __dirname,
  'public',
  'site/assets/favicon/favicon.ico'
); // set favicon path
/**
 * Configure express-session and connect-mongo
 * - secret: set secret for express-session
 * - resave: set resave option for express-session
 * - saveUninitialized: set saveUninitialized option for express-session
 * - cookie: set cookie options for express-session
 * - store: set store option for express-session
 *  - mongoUrl: set mongoUrl for connect-mongo
 */
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: cookieExpirationDate
  },
  store: connectMongo.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: cookieExpirationDate
  }),
  unset: 'destroy' // destroy session when user logs out (req.logout()) or session expires
};
/**
 * Configure cors
 * - origin: set origin for cors options in development mode
 * - credentials: set credentials for cors options
 */
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionOptions.cookie.secure = true; // serve secure cookies
  sessionOptions.cookie.sameSite = true; // serve sameSite cookies
  sessionOptions.cookie.domain = appConf.site.domain; // set domain for session cookie in production mode (e.g. .example.com)
  corsOptions.origin = appConf.site.domain; // set origin for cors options in production mode
}

app.locals = appConf; // set app locals from app.conf.json file (e.g. app.locals.siteName)

app.set('view engine', 'pug'); // set view engine
app.set('views', viewsDir); // set views directory

app.use(favicon(faviconPath)); // serve favicon
app.use(express.static(publicDir)); // serve static files

app.use(helmet()); // set security headers
app.use(morgan('dev')); // log requests to the console (dev)
app.use(cors(corsOptions)); // enable cors
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(session(sessionOptions)); // use express-session
app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // use passport session
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
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running.'
    );
    process.exit();
  });
  mongoose.connection.once('open', () => {
    console.log('MongoDB connected successfully!');
  });
} else {
  console.warn(
    'MONGO_URI environment variable is not defined. Skipping MongoDB connection.'
  );
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
