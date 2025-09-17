const { StatusCodes } = require("http-status-codes")
const { ErrorResponse } = require("../utils/common")
const AppError = require("../utils/errors/app-error")

function validateCreateRequest(req, res, next)
{
    if (!req.body)
    {
        const errorResponse = new ErrorResponse("req.body not found", new AppError("req.body not found", StatusCodes.BAD_REQUEST));
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    const elements = ["flightId", "userId", "numberOfSeats"];

    for (const elem of elements)
    {
        if (!req.body[elem])
        {
            const errorResponse = new ErrorResponse(`${elem} not found`, new AppError(`${elem} not found`, StatusCodes.BAD_REQUEST));
            return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
        }
    }

    if (isNaN(req.body.numberOfSeats))
    {
        const errorResponse = new ErrorResponse(`numberOfSeats invalid in the request`, new AppError(`numberOfSeats invalid in the request`, StatusCodes.BAD_REQUEST));
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    next();
}

async function validatePaymentRequest(req, res, next)
{
    if (!req.body)
    {
        const errorResponse = new ErrorResponse("req.body not found", new AppError("req.body not found", StatusCodes.BAD_REQUEST));
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    const elements = ["userId", "bookingId", "totalCost"];

    for (const elem of elements)
    {
        if (!req.body[elem])
        {
            const errorResponse = new ErrorResponse(`${elem} not found`, new AppError(`${elem} not found`, StatusCodes.BAD_REQUEST));
            return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
        }
    }

    if (isNaN(req.body.totalCost))
    {
        const errorResponse = new ErrorResponse(`totalCost invalid in the request`, new AppError(`numberOfSeats invalid in the request`, StatusCodes.BAD_REQUEST));
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    next();
}

module.exports = {
    validateCreateRequest,
    validatePaymentRequest
}