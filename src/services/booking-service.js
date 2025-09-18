const axios = require("axios")
const { ENUMS } = require("../utils/common")
const { StatusCodes } = require("http-status-codes")

const db = require("../models")
const { ServerConfig } = require("../config")
const CrudService = require("./crud-service")
const AppError = require("../utils/errors/app-error")
const { BookingRepository } = require("../repositories")
const { compareTimeWithDiff } = require("../utils/helpers/date-time-helper")

const bookingRepository = new BookingRepository();

class BookingService extends CrudService {
    constructor()
    {
        super('Booking', bookingRepository);
    }

    async createBooking(data)
    {
        const trn = await db.sequelize.transaction();

        try {
            const response = await axios.get(`${ServerConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}`);
            const flight = response.data?.data;

            if (flight.totalSeats < data.numberOfSeats) {
                throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
            }

            const billingAmount = data.numberOfSeats * flight.price;
            const bookingPayload = { ...data, totalCost: billingAmount };
            const booking = await bookingRepository.createBooking(bookingPayload, trn);

            await axios.patch(`${ServerConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}/seats`, {
                seats: data.numberOfSeats,
                dec: 1
            })
            
            await trn.commit();
            return booking;
        }
        catch(err) {
            await trn.rollback();
            console.log(err.message);

            if (err instanceof AppError) {
                throw err;
            }

            throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async cancelBooking(bookingId)
    {
        const trn = await db.sequelize.transaction();

        try {
            const bookingDetails = await bookingRepository.get(bookingId);

            if (bookingDetails.status == ENUMS.BOOKING_STATUS.CANCELLED) {
                trn.commit();
                return true;
            }

            await bookingRepository.update(bookingId, { status: ENUMS.BOOKING_STATUS.CANCELLED }, trn);
            await axios.patch(`${ServerConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${bookingDetails.flightId}/seats`, {
                seats: bookingDetails.numberOfSeats,
                dec: 0
            })
            
            await trn.commit();
            return true;
        }
        catch(err) {
            await trn.rollback();
            return false;
        }
    }

    async makePayment(data)
    {
        const trn = await db.sequelize.transaction();

        try {
            const bookingDetails = await bookingRepository.get(data.bookingId);

            if (bookingDetails.status == ENUMS.BOOKING_STATUS.BOOKED) {
                throw new AppError("Payment already done", StatusCodes.CONFLICT);
            }

            if (bookingDetails.status == ENUMS.BOOKING_STATUS.CANCELLED) {
                throw new AppError("Booking is cancelled, please try again", StatusCodes.CONFLICT);
            }
            
            if (bookingDetails.totalCost != data.totalCost || bookingDetails.userId != data.userId) {
                throw new AppError("Payment details do not match", StatusCodes.BAD_REQUEST);
            }

            if (!compareTimeWithDiff(bookingDetails.createdAt, new Date(), 1)) {
                await this.cancelBooking(data.bookingId);
                throw new AppError("Payment gateaway expired, please book again", StatusCodes.GATEWAY_TIMEOUT);
            }
            
            const [response] = await bookingRepository.update(data.bookingId, { status: ENUMS.BOOKING_STATUS.BOOKED }, trn);

            await trn.commit();
            return response;
        }
        catch(err) {
            await trn.rollback();

            if (err instanceof AppError) {
                throw err;
            }

            throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = BookingService