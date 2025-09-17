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

        const successResponse = new SuccessResponse("Created a booking", response);
        return res.status(StatusCodes.CREATED).json(successResponse);
    }
    catch(err) {
        const errorResponse = new ErrorResponse(err.message, err);
        return res.status(err.statusCode).json(errorResponse);
    }
}

async function makePayment(req, res)
{
    try {
        const response = await bookingService.makePayment({
            userId: req.body.userId,
            bookingId: req.body.bookingId,
            totalCost: req.body.totalCost
        })

        const successResponse = new SuccessResponse("Payment successful");
        return res.status(StatusCodes.CREATED).json(successResponse);
    }
    catch(err) {
        const errorResponse = new ErrorResponse(err.message, err);
        return res.status(err.statusCode).json(errorResponse);
    }
}

module.exports = {
    createBooking,
    makePayment
}