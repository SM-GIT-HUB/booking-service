
class SuccessResponse {
    constructor()
    {
        this.success = true;
        this.message = "Successfully completed the request";
        this.data = {};
        this.error = {};
    }
}

module.exports = SuccessResponse