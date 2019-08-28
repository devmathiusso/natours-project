const AppError = require("./../utils/appError");

const handleCastErrorDatabase = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDatabase = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDatabase = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJwtExpiredError = () =>
  new AppError("Your token has expired. Please log in again!", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Operational, trusted error: send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknow error: don't leak error details

    // 1) Log error
    console.error("ERROR 💣", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!"
    });
  }
};

module.exports = (err, req, res, next) => {
  //console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") {
      error = handleCastErrorDatabase(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateFieldsDatabase(error);
    }

    if (error.name === "ValidationError") {
      error = handleValidationErrorDatabase(error);
    }

    if (error.name === "JsonWebTokenError") {
      error = handleJwtError();
    }

    if (error.name === "TokenExpiredError") {
      error = handleJwtExpiredError();
    }

    sendErrorProd(error, res);
  }
};
