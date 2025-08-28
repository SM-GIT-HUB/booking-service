
class ErrorResponse {
    constructor(message, err)
    {
        this.success = false;
        this.message = message? message : "Something went wrong";
        this.data = {};
        this.error = err? err : {};
    }
}

module.exports = ErrorResponse