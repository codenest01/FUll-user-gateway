var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connectDB = require('./config/data-base');
var routes = require("./routes/routes")
var mailer = require("./utils/mailer")
var upload = require('./utils/multerConfig');
var ensureAuthenticated = require('./middlewares/authMiddleware')
require('dotenv').config();

var app = express();
connectDB();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Set port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



app.get('/test', (req, res , next) => {
  res.render('test'); 
});


app.post('/upload', upload.single("image"), (req, res, next) => {
  console.log(req.body);
  res.send('Image uploaded successfully');
});

app.use("/api/v1", routes); 
app.use('/auth', ensureAuthenticated);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
