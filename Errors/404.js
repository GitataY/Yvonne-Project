const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("./errors");
class notFound extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
module.exports = notFound;
