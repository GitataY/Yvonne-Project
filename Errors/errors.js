//-------------------------------------------------------------OOP
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
//------------------------------------------------------Initialize An Error Handler
const CustomErrorHandler = (message, statusCode) => {
  return new CustomError(message, statusCode);
};
module.exports = { CustomErrorHandler, CustomError };
