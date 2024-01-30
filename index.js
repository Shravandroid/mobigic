const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// database config
require('dotenv').config()
require('./db')()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

// handle catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

const PORT = process.env.PORT || 4000


app.listen(PORT, () => {
   console.log(`Server listening on PORT: ${PORT}`);
});


module.exports = app;
