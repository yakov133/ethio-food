const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');

const app = express();
const allowedClientOrigins = process.env.CLIENT_ORIGINS
  ? process.env.CLIENT_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : true;

// CLIENT_ORIGINS lets the API run independently from the client on Render.
app.use(logger('dev'));
app.use(cors({ origin: allowedClientOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health endpoints keep the API service deployable and testable on Render by itself.
app.get(['/', '/health'], (req, res) => {
  res.json({ status: "ok", service: "ethio-food-api" });
});

// API routes
app.use('/', indexRouter);

// API callers receive JSON errors, while browser fallback requests get plain text.
app.use(function (err, req, res, next) {
  if (err.code === "LIMIT_FILE_SIZE") {
    err.status = 413;
    err.message = "Image is too large";
  }

  const status = err.status || err.statusCode || 500;
  const message = status >= 500 ? "Server error" : err.message;

  if (req.get("accept") && req.get("accept").includes("application/json")) {
    return res.status(status).json({ error: message });
  }

  return res.status(status).send(message);
});

module.exports = app;


