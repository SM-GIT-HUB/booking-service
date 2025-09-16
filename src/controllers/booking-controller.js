const { BookingService } = require("../services")
const { StatusCodes } = require("http-status-codes")
const { SuccessResponse, ErrorResponse} = require("../utils/common")

const bookingService = new BookingService();

async function createBooking(req, res)
{
    try {
        const response = await bookingService.createBooking({
            userId: req.body.userId,
            flightId: req.body.flightId,
            numberOfSeats: req.body.numberOfSeats
        })

        const successResponse = new SuccessResponse();
        successResponse.data = response;

        return res.status(StatusCodes.CREATED).json(successResponse);
    }
    catch(err) {
        const errorResponse = new ErrorResponse(err.message, err);
        return res.status(err.statusCode).json(errorResponse);
    }
}

module.exports = {
    createBooking
}