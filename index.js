const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const { auth } = require("./utils/auth");
const app = express();

// database config
require("dotenv").config();
require("./db")();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/uploads/inventory", express.static(__dirname + "/uploads/inventory"));
app.use("/public", express.static(__dirname + "/public"));

app.use(auth);
require("./routes")(app);
app.use(errorHandler)

// handle catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((req, res, next) => {
  console.log(`Request received on ${req.path}`);
  next();
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

module.exports = app;

function errorHandler(err, req, res, next) {
  const statusCode = err.status ?? 500;
  return res.status(statusCode ?? 500).json({
    error: statusCode,
    message: err.message,
  });
};
