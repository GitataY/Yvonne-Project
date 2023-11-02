const { default: mongoose } = require("mongoose");
const { CustomError } = require("../Errors/errors");
const { StatusCodes } = require("http-status-codes");

const customErrorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ msg: error.message });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, msg: error.message });
};
module.exports = { customErrorHandler };
