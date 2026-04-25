class ApiError extends Error {
  constructor(statusCode, message , data = null, error = []) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = false;
    this.error = error;

    Error.captureStackTrace(this, this.constructor);
  
  }

}
module.exports=ApiError