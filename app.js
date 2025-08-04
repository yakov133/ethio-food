console.log("app is loading");
const express = require('express');
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// ייבוא הנתיבים שלך
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

console.log("Server is starting...");

// הגדרות מערכת
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// משרת את קבצי ה־React מהתיקייה build (אחרי npm run build)
app.use(express.static(path.resolve(__dirname, 'client', 'build')));

// משרת את הקבצים הציבוריים אם יש (תמונות, קבצי סטטיים)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 🔥 זה החלק הקריטי — כל route אחר יחזיר את index.html של React
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// ניהול שגיאות
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
