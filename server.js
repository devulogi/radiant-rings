const express = require('express');
const path = require('path');
const morgan = require('morgan');
const favicon = require('serve-favicon')
require('dotenv').config();

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const viewsDir = path.join(__dirname, 'views');
const app = express();

app.set('view engine', 'pug');
app.set('views', `${viewsDir}/pages`);

app.use(favicon(path.join(__dirname, 'public', 'assets/favicon/favicon.ico')));
app.use(express.static(publicDir));

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('home-page', { title: 'Home', cart: { items: 49 } });
});

app.get('/about', (req, res) => {
  res.render('about-page', { title: 'About' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
