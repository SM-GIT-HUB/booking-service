
class SuccessResponse {
    constructor(message, data)
    {
        this.success = true;
        this.message = message? message : "Successfully completed the request";
        this.data = data? data : {};
        this.error = {};
    }
}

module.exports = SuccessResponse